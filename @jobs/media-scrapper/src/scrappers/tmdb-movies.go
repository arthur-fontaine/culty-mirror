package scrappers

import (
	"context"
	"log"
	"strconv"
	"time"

	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
	mediadb "github.com/arthur-fontaine/culty/services/media-db/prisma/generated/clientgo"

	tmdb "github.com/cyruzin/golang-tmdb"
)

const source = "tmdb"

func ScrapTMDB(
	env utils.Env,
	mediadbClient *mediadb.PrismaClient,
) chan mediadb.MediaModel {
	medias := make(chan mediadb.MediaModel)

	minimumId := getLastIdSaved(mediadbClient)

	tmdbClient, err := tmdb.Init(env.TMDB_API_KEY)
	if err != nil {
		log.Println("Failed to initialize TMDB client", err)
		return nil
	}

	latestMovie, err := tmdbClient.GetMovieLatest(map[string]string{})
	if err != nil {
		log.Println("Failed to get latest movie", err)
		return nil
	}
	latestId := int(latestMovie.ID)

	go func() {
		for i := minimumId; i <= latestId; i++ {
			movie, err := tmdbClient.GetMovieDetails(i, map[string]string{})
			if err != nil {
				log.Println("Failed to get movie details", i, err)
				continue
			}

			layout := "2006-01-02"
			releaseDate, err := time.Parse(layout, movie.ReleaseDate)
			if err != nil {
				log.Println("Failed to parse release date", i, movie.ReleaseDate, err, "... skipping.")
				continue
			}

			imageUrl := ""
			if len(movie.PosterPath) > 0 {
				imageUrl = "https://image.tmdb.org/t/p/original" + movie.PosterPath
			} else {
				log.Println("Failed to get image url", i, movie.Title, "(", movie.ID, ")", "... skipping.")
			}

			categories := []string{}
			for _, genre := range movie.Genres {
				categories = append(categories, genre.Name)
			}

			medias <- mediadb.MediaModel{
				InnerMedia: mediadb.InnerMedia{
					Title:             movie.Title,
					Type:              mediadb.MediaTypeMovie,
					Description:       movie.Overview,
					ReleaseDate:       releaseDate,
					DurationInMinutes: movie.Runtime,
					Source:            source,
					Categories:        categories,
					SourceID:          strconv.Itoa(i),
				},
				RelationsMedia: mediadb.RelationsMedia{
					Assets: []mediadb.MediaImageModel{
						{
							InnerMediaImage: mediadb.InnerMediaImage{
								URL: imageUrl,
							},
						},
					},
				},
			}
		}
	}()

	return medias
}

func getLastIdSaved(mediadbClient *mediadb.PrismaClient) int {
	// TODO: Error "Failed to get last saved media ErrNotFound"
	v, err := mediadbClient.Media.FindFirst(
		mediadb.Media.Source.Equals(source),
		mediadb.Media.SourceID.Order(mediadb.SortOrderDesc),
	).Exec(context.Background())

	if err != nil {
		log.Println("Failed to get last saved media", err)
		return 0
	}

	lastIdStr := (*v).SourceID

	lastId, err := strconv.Atoi(lastIdStr)
	if err != nil {
		log.Println("Failed to convert last saved media id to int", err)
		return 0
	}

	return lastId
}

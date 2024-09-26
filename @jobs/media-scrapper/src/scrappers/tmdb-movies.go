package scrappers

import (
	"context"
	"fmt"
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
		fmt.Println(err)
		return nil
	}

	latestMovie, err := tmdbClient.GetMovieLatest(map[string]string{})
	if err != nil {
		fmt.Println(err)
		return nil
	}
	latestId := int(latestMovie.ID)

	go func() {
		for i := minimumId; i <= latestId; i++ {
			movie, err := tmdbClient.GetMovieDetails(i, map[string]string{})
			if err != nil {
				fmt.Println(err)
				continue
			}

			layout := "2006-01-02"
			releaseDate, err := time.Parse(layout, movie.ReleaseDate)
			if err != nil {
				fmt.Println(err)
				continue
			}

			medias <- mediadb.MediaModel{
				InnerMedia: mediadb.InnerMedia{
					Title:       movie.Title,
					Type:        mediadb.MediaTypeMovie,
					Description: movie.Overview,
					ReleaseDate: releaseDate,
					Source:      source,
					SourceID:    strconv.Itoa(i),
				},
			}
		}
	}()

	return medias
}

func getLastIdSaved(mediadbClient *mediadb.PrismaClient) int {
	v, err := mediadbClient.Media.FindFirst(
		mediadb.Media.Source.Equals(source),
		mediadb.Media.SourceID.Order(mediadb.SortOrderDesc),
	).Exec(context.Background())

	if err != nil {
		fmt.Println(err)
		return 0
	}

	lastIdStr := (*v).SourceID

	lastId, err := strconv.Atoi(lastIdStr)
	if err != nil {
		fmt.Println(err)
		return 0
	}

	return lastId
}

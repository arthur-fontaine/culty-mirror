package scrappers

import (
	"fmt"
	"time"

	"github.com/arthur-fontaine/culty/jobs/media-scrapper/node_modules/culty-media-db/types/go/mediadb"
	"github.com/arthur-fontaine/culty/jobs/media-scrapper/src/utils"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/google/uuid"
)

func ScrapTMDB(env utils.Env, minimumId int) chan mediadb.Media {
	medias := make(chan mediadb.Media)

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

			releaseDate, err := calculateReleaseDate(movie.ReleaseDate)
			if err != nil {
				fmt.Println(err)
				continue
			}

			medias <- mediadb.Media{
				Id:          uuid.New().String(),
				Type:        mediadb.New_MediaType(mediadb.MediaType_MOVIE),
				Title:       movie.Title,
				Description: movie.Overview,
				ReleaseDate: releaseDate,
				Source:      "tmdb",
				SourceId:    fmt.Sprint(movie.ID),
			}
		}
	}()

	return medias
}

func calculateReleaseDate(releaseDate string) (int, error) {
	layout := "2006-01-02"
	t, err := time.Parse(layout, releaseDate)
	if err != nil {
		return 0, err
	}

	// Return the number of hours since 1970 01 01
	return int(t.Unix() / 3600), nil
}

package scrappers

import (
	"context"
	"fmt"
	"strconv"
	"time"

	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
	mediadb "github.com/arthur-fontaine/culty/services/media-db/types/go/mediadb"

	tmdb "github.com/cyruzin/golang-tmdb"
	"github.com/google/uuid"
	"github.com/typesense/typesense-go/v2/typesense"
	typesenseApi "github.com/typesense/typesense-go/v2/typesense/api"
	typesensePointer "github.com/typesense/typesense-go/v2/typesense/api/pointer"
)

func ScrapTMDB(
	env utils.Env,
	mediaCollection typesense.CollectionInterface[*mediadb.Media],
) chan mediadb.Media {
	medias := make(chan mediadb.Media)

	minimumId := getLastIdSaved(mediaCollection)

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

func getLastIdSaved(mediaCollection typesense.CollectionInterface[*mediadb.Media]) int {
	lastTMDBDocument, err := mediaCollection.Documents().Search(context.Background(), &typesenseApi.SearchCollectionParams{
		Q:       typesensePointer.String("tmdb"),
		QueryBy: typesensePointer.String("source"),
		SortBy:  typesensePointer.String("sourceId:desc"),
		Limit:   typesensePointer.Int(1),
	})

	if err != nil {
		fmt.Println(err)
		return 0
	}

	if *lastTMDBDocument.Found > 0 {
		lastId, err := strconv.Atoi((*(*lastTMDBDocument.Hits)[0].Document)["sourceId"].(string))

		if err != nil {
			fmt.Println(err)
			return 0
		}

		return lastId
	}

	return 0
}

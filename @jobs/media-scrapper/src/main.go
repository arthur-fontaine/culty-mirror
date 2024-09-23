package main

import (
	"context"
	"time"

	"github.com/arthur-fontaine/culty/jobs/media-scrapper/src/scrappers"
	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
	typesenseutils "github.com/arthur-fontaine/culty/services/media-db/src"
	mediadb "github.com/arthur-fontaine/culty/services/media-db/types/go/mediadb"

	"github.com/typesense/typesense-go/v2/typesense"
	typesenseApi "github.com/typesense/typesense-go/v2/typesense/api"
	typesensePointer "github.com/typesense/typesense-go/v2/typesense/api/pointer"
)

type Media struct {
	Id          string `json:"id"`
	Type        string `json:"type"`
	Title       string `json:"title"`
	Description string `json:"description"`
	ReleaseDate int    `json:"releaseDate"`
	Source      string `json:"source"`
	SourceId    string `json:"sourceId"`
}

func main() {
	env := utils.GetEnv()
	typesenseClient := typesenseutils.GetTypesenseClient(env)

	for {
		typesenseIsUp, _ := typesenseClient.Health(context.Background(), 10*time.Second)
		time.Sleep(1 * time.Second)
		if typesenseIsUp {
			break
		}
	}

	collectionSchema := getTypesenseMediaSchema(env)
	_, err := typesenseutils.UpsertTypesenseCollection(typesenseClient, collectionSchema)

	if err != nil {
		panic(err)
	}

	collection := typesense.GenericCollection[*mediadb.Media](typesenseClient, env.TYPESENSE_MEDIA_COLLECTION_NAME)

	for media := range utils.MergeChan(scrappers.ScrapTMDB(env, collection)) {
		collection.Documents().Create(context.Background(), media)
	}
}

func getTypesenseMediaSchema(env utils.Env) typesenseApi.CollectionSchema {
	schema := typesenseApi.CollectionSchema{
		Name: env.TYPESENSE_MEDIA_COLLECTION_NAME,
		Fields: []typesenseApi.Field{
			{
				Name:  "type",
				Type:  "string",
				Facet: typesensePointer.True(),
			},
			{
				Name: "title",
				Type: "string",
			},
			{
				Name: "description",
				Type: "string",
			},
			{
				Name:  "releaseDate",
				Type:  "int32",
				Facet: typesensePointer.True(),
			},
			{
				Name: "source",
				Type: "string",
			},
			{
				Name: "sourceId",
				Type: "string",
				Sort: typesensePointer.True(),
			},
		},
		DefaultSortingField: typesensePointer.String("releaseDate"),
	}
	return schema
}

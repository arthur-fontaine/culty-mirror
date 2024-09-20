package utils

import (
	"context"

	"github.com/typesense/typesense-go/v2/typesense"
	typesenseApi "github.com/typesense/typesense-go/v2/typesense/api"
)

func UpsertTypesenseCollection(
	typesenseClient *typesense.Client,
	schema typesenseApi.CollectionSchema,
) (*typesenseApi.CollectionResponse, error) {
	collectionResponse, err := typesenseClient.Collections().Retrieve(context.Background())
	if err == nil {
		for _, c := range collectionResponse {
			if c.Name == schema.Name {
				return c, nil
			}
		}
	}
	return typesenseClient.Collections().Create(context.Background(), &schema)
}

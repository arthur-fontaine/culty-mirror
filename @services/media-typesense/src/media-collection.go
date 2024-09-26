package typesenseutils

import (
	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
	"github.com/arthur-fontaine/culty/services/media-typesense/types/go/mediatypesense"
	"github.com/typesense/typesense-go/v2/typesense"
	typesenseApi "github.com/typesense/typesense-go/v2/typesense/api"
	typesensePointer "github.com/typesense/typesense-go/v2/typesense/api/pointer"
)

func GetMediaCollectionSchema(env utils.Env) *typesenseApi.CollectionSchema {
	return &typesenseApi.CollectionSchema{
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
		},
		DefaultSortingField: typesensePointer.String("releaseDate"),
	}
}

func GetMediaCollection(env utils.Env, typesenseClient *typesense.Client) typesense.CollectionInterface[*mediatypesense.Media] {
	return typesense.GenericCollection[*mediatypesense.Media](typesenseClient, env.TYPESENSE_MEDIA_COLLECTION_NAME)
}

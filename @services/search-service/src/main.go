package main

import (
	"context"

	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
	typesenseutils "github.com/arthur-fontaine/culty/services/media-db/src"
	"github.com/arthur-fontaine/culty/services/search-service/types/go/services/search"

	"github.com/palantir/witchcraft-go-server/v2/config"
	"github.com/palantir/witchcraft-go-server/v2/witchcraft"
	"github.com/samber/lo"
	typesenseApi "github.com/typesense/typesense-go/v2/typesense/api"
	typesensePointer "github.com/typesense/typesense-go/v2/typesense/api/pointer"
)

type SearchService struct{}

func (s *SearchService) Search(ctx context.Context, requestArg search.SearchRequest) (search.SearchResponse, error) {
	env := utils.GetEnv()
	typesenseClient := typesenseutils.GetTypesenseClient(env)

	searchParameters := &typesenseApi.SearchCollectionParams{
		Q:       typesensePointer.String(requestArg.Query),
		QueryBy: typesensePointer.String("title"),
	}

	results, err := typesenseClient.Collection(env.TYPESENSE_MEDIA_COLLECTION_NAME).Documents().Search(context.Background(), searchParameters)

	if err != nil {
		return search.SearchResponse{}, err
	}

	return search.SearchResponse{
		Results: lo.Map(
			*results.Hits,
			func(result typesenseApi.SearchResultHit, _ int) search.SearchResult {
				document := *result.Document
				return search.SearchResult{
					ResultId: document["id"].(string),
					Score:    0, // TODO
					Title:    document["title"].(string),
				}
			},
		),
	}, nil
}

func main() {
	env := utils.GetEnv()

	if err := witchcraft.NewServer().
		WithInitFunc(func(ctx context.Context, info witchcraft.InitInfo) (func(), error) {
			if err := search.RegisterRoutesSearchService(info.Router, &SearchService{}); err != nil {
				return nil, err
			}
			return nil, nil
		}).
		WithSelfSignedCertificate().
		WithECVKeyProvider(witchcraft.ECVKeyNoOp()).
		WithInstallConfig(config.Install{
			ProductName: "search-service",
			Server: config.Server{
				Port: env.SEARCH_SERVICE_PORT,
			},
			UseConsoleLog: true,
		}).
		WithRuntimeConfig(config.Runtime{}).
		Start(); err != nil {
		panic(err)
	}
}

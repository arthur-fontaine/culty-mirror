package main

import (
	"context"
	"log"
	"time"

	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
	mediaDb "github.com/arthur-fontaine/culty/services/media-db/prisma/generated/clientgo"
	"github.com/arthur-fontaine/culty/services/media-service/types/go/services/media"

	"github.com/samber/lo"

	"github.com/palantir/witchcraft-go-server/v2/config"
	"github.com/palantir/witchcraft-go-server/v2/witchcraft"
)

type MediaService struct {
	mediaDb *mediaDb.PrismaClient
	env     utils.Env
}

func (m *MediaService) GetById(ctx context.Context, requestArg media.GetByIdRequest) (media.Media, error) {
	foundMedias, err := m.mediaDb.Media.FindMany(
		mediaDb.Media.ID.Equals(requestArg.MediaId),
	).With(
		mediaDb.Media.Assets.Fetch(),
	).Exec(ctx)

	if err != nil || len(foundMedias) == 0 {
		return media.Media{}, media.NewMediaNotFound()
	}

	foundMedia := foundMedias[0]

	return media.Media{
		MediaId: foundMedia.ID,
		Title:   foundMedia.Title,
		Images: lo.Map(
			foundMedia.Assets(),
			func(asset mediaDb.MediaImageModel, _ int) media.Image {
				return media.Image{
					Url:       m.env.ASSETS_URL + "/f_webp/media_image/" + asset.URL,
					Width:     asset.Width,
					Height:    asset.Height,
					Thumbhash: asset.Thumbhash,
				}
			},
		),
	}, nil
}

func main() {
	env := utils.GetEnv()

	if err := witchcraft.NewServer().
		WithInitFunc(func(ctx context.Context, info witchcraft.InitInfo) (func(), error) {
			db := mediaDb.NewClient(mediaDb.WithDatasourceURL(env.MEDIA_DB_MONGO_URL))

			time.Sleep(time.Duration(env.MEDIA_INTERACTIONS_DB_INIT_SLEEP) * time.Second)

			if err := db.Connect(); err != nil {
				log.Fatalln("Failed to connect to MongoDB", err)
			}

			if err := media.RegisterRoutesMediaService(info.Router, &MediaService{
				env:     env,
				mediaDb: db,
			}); err != nil {
				return nil, err
			}
			return nil, nil
		}).
		WithSelfSignedCertificate().
		WithECVKeyProvider(witchcraft.ECVKeyNoOp()).
		WithInstallConfig(config.Install{
			ProductName: "media-service",
			Server: config.Server{
				Port: env.MEDIA_SERVICE_PORT,
			},
			UseConsoleLog: true,
		}).
		WithRuntimeConfig(config.Runtime{}).
		Start(); err != nil {
		panic(err)
	}
}

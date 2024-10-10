package main

import (
	"context"
	"errors"
	"log"
	"time"

	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
	mediaInteractionsDb "github.com/arthur-fontaine/culty/services/media-interactions-db/prisma/generated/clientgo"
	"github.com/arthur-fontaine/culty/services/media-interactions-service/types/go/services/mediainteractions"

	"github.com/palantir/witchcraft-go-server/v2/config"
	"github.com/palantir/witchcraft-go-server/v2/witchcraft"
)

type MediaInteractionsService struct {
	mediaInteractionsDb *mediaInteractionsDb.PrismaClient
}

func (m *MediaInteractionsService) getMediaInteraction(ctx context.Context, userId string, mediaId string) (*mediaInteractionsDb.MediaInteractionModel, error) {
	mediaInteraction, err := m.mediaInteractionsDb.MediaInteraction.FindFirst(
		mediaInteractionsDb.MediaInteraction.MediaID.Equals(mediaId),
		mediaInteractionsDb.MediaInteraction.UserID.Equals(userId),
	).Exec(ctx)

	if err != nil {
		return nil, err
	}

	return mediaInteraction, nil
}

func (m *MediaInteractionsService) upsertInteraction(
	ctx context.Context,
	userId string,
	mediaId string,
	mediaInteraction *mediaInteractionsDb.MediaInteractionModel,
	values ...mediaInteractionsDb.MediaInteractionSetParam,
) {
	if mediaInteraction != nil {
		_, err := m.mediaInteractionsDb.MediaInteraction.FindUnique(
			mediaInteractionsDb.MediaInteraction.ID.Equals(mediaInteraction.ID),
		).Update(values...).Exec(ctx)

		if err != nil {
			panic(err)
		}
	} else {
		_, err := m.mediaInteractionsDb.MediaInteraction.CreateOne(
			mediaInteractionsDb.MediaInteraction.MediaID.Set(mediaId),
			mediaInteractionsDb.MediaInteraction.UserID.Set(userId),
			values...,
		).Exec(ctx)

		if err != nil {
			panic(err)
		}
	}
}

func (m *MediaInteractionsService) GetInteractions(ctx context.Context, requestArg mediainteractions.GetInteractionsRequest) (mediainteractions.GetInteractionsResponse, error) {
	mediaInteraction, err := m.getMediaInteraction(ctx, requestArg.UserId, requestArg.MediaId)

	if errors.Is(err, mediaInteractionsDb.ErrNotFound) {
		return mediainteractions.GetInteractionsResponse{}, nil
	}

	if err != nil {
		return mediainteractions.GetInteractionsResponse{}, err
	}

	rating, _ := mediaInteraction.Rating()

	return mediainteractions.GetInteractionsResponse{
		Consumed:   &mediaInteraction.Consumed,
		Rating:     &rating,
		Bookmarked: &mediaInteraction.Bookmark,
		Favorited:  &mediaInteraction.Favorite,
	}, nil
}

func (m *MediaInteractionsService) Bookmark(ctx context.Context, requestArg mediainteractions.InteractRequest) error {
	// A media can't be bookmarked if:
	// - it has been consumed
	// - it has been rated
	// - it has been favorited

	mediaInteraction, err := m.getMediaInteraction(ctx, requestArg.UserId, requestArg.MediaId)

	if err != nil && !errors.Is(err, mediaInteractionsDb.ErrNotFound) {
		return err
	}

	if mediaInteraction != nil {
		if _, ratingExists := mediaInteraction.Rating(); mediaInteraction.Consumed || ratingExists || mediaInteraction.Favorite {
			return mediainteractions.NewActionImpossible()
		}
	}

	m.upsertInteraction(
		ctx,
		requestArg.UserId,
		requestArg.MediaId,
		mediaInteraction,
		mediaInteractionsDb.MediaInteraction.Bookmark.Set(true),
	)

	return nil
}

func (m *MediaInteractionsService) Unbookmark(ctx context.Context, requestArg mediainteractions.InteractRequest) error {
	// A media can always be unbookmarked

	mediaInteraction, err := m.getMediaInteraction(ctx, requestArg.UserId, requestArg.MediaId)

	if err != nil && !errors.Is(err, mediaInteractionsDb.ErrNotFound) {
		return err
	}

	m.upsertInteraction(
		ctx,
		requestArg.UserId,
		requestArg.MediaId,
		mediaInteraction,
		mediaInteractionsDb.MediaInteraction.Bookmark.Set(false),
	)

	return nil
}

func (m *MediaInteractionsService) Consume(ctx context.Context, requestArg mediainteractions.InteractRequest) error {
	// A media can't be consumed if:
	// - it has already been consumed
	// When a media is consumed:
	// - it should be unbookmarked

	mediaInteraction, err := m.getMediaInteraction(ctx, requestArg.UserId, requestArg.MediaId)

	if err != nil && !errors.Is(err, mediaInteractionsDb.ErrNotFound) {
		return err
	}

	if mediaInteraction != nil && mediaInteraction.Consumed {
		return mediainteractions.NewActionImpossible()
	}

	m.upsertInteraction(
		ctx,
		requestArg.UserId,
		requestArg.MediaId,
		mediaInteraction,
		mediaInteractionsDb.MediaInteraction.Consumed.Set(true),
		mediaInteractionsDb.MediaInteraction.Bookmark.Set(false),
	)

	return nil
}

func (m *MediaInteractionsService) Unconsume(ctx context.Context, requestArg mediainteractions.InteractRequest) error {
	// A media can always be unconsumed

	mediaInteraction, err := m.getMediaInteraction(ctx, requestArg.UserId, requestArg.MediaId)

	if err != nil && !errors.Is(err, mediaInteractionsDb.ErrNotFound) {
		return err
	}

	m.upsertInteraction(
		ctx,
		requestArg.UserId,
		requestArg.MediaId,
		mediaInteraction,
		mediaInteractionsDb.MediaInteraction.Consumed.Set(false),
	)

	return nil
}

func (m *MediaInteractionsService) Favorite(ctx context.Context, requestArg mediainteractions.InteractRequest) error {
	// A media can't be favorited if:
	// - it has not been consumed

	mediaInteraction, err := m.getMediaInteraction(ctx, requestArg.UserId, requestArg.MediaId)

	if err != nil && !errors.Is(err, mediaInteractionsDb.ErrNotFound) {
		return err
	}

	if mediaInteraction != nil && !mediaInteraction.Consumed {
		return mediainteractions.NewActionImpossible()
	}

	m.upsertInteraction(
		ctx,
		requestArg.UserId,
		requestArg.MediaId,
		mediaInteraction,
		mediaInteractionsDb.MediaInteraction.Favorite.Set(true),
	)

	return nil
}

func (m *MediaInteractionsService) Unfavorite(ctx context.Context, requestArg mediainteractions.InteractRequest) error {
	// A media can always be unfavorited

	mediaInteraction, err := m.getMediaInteraction(ctx, requestArg.UserId, requestArg.MediaId)

	if err != nil && !errors.Is(err, mediaInteractionsDb.ErrNotFound) {
		return err
	}

	m.upsertInteraction(
		ctx,
		requestArg.UserId,
		requestArg.MediaId,
		mediaInteraction,
		mediaInteractionsDb.MediaInteraction.Favorite.Set(false),
	)

	return nil
}

func (m *MediaInteractionsService) Rate(ctx context.Context, requestArg mediainteractions.RateRequest) error {
	// A media can't be rated if:
	// - it has not been consumed

	mediaInteraction, err := m.getMediaInteraction(ctx, requestArg.UserId, requestArg.MediaId)

	if err != nil && !errors.Is(err, mediaInteractionsDb.ErrNotFound) {
		return err
	}

	if mediaInteraction != nil && !mediaInteraction.Consumed {
		return mediainteractions.NewActionImpossible()
	}

	m.upsertInteraction(
		ctx,
		requestArg.UserId,
		requestArg.MediaId,
		mediaInteraction,
		mediaInteractionsDb.MediaInteraction.Rating.Set(*requestArg.Rating),
	)

	return nil
}

func main() {
	env := utils.GetEnv()

	if err := witchcraft.NewServer().
		WithInitFunc(func(ctx context.Context, info witchcraft.InitInfo) (func(), error) {
			db := mediaInteractionsDb.NewClient(mediaInteractionsDb.WithDatasourceURL(env.MEDIA_DB_MONGO_URL))

			time.Sleep(time.Duration(env.MEDIA_INTERACTIONS_DB_INIT_SLEEP) * time.Second)

			if err := db.Connect(); err != nil {
				log.Fatalln("Failed to connect to MongoDB", err)
			}

			if err := mediainteractions.RegisterRoutesMediaInteractionsService(info.Router, &MediaInteractionsService{
				mediaInteractionsDb: db,
			}); err != nil {
				return nil, err
			}
			return nil, nil
		}).
		WithSelfSignedCertificate().
		WithECVKeyProvider(witchcraft.ECVKeyNoOp()).
		WithInstallConfig(config.Install{
			ProductName: "media-interactions-service",
			Server: config.Server{
				Port: env.MEDIA_INTERACTIONS_SERVICE_PORT,
			},
			UseConsoleLog: true,
		}).
		WithRuntimeConfig(config.Runtime{}).
		Start(); err != nil {
		panic(err)
	}
}

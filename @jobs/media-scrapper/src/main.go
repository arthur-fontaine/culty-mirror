package main

import (
	"context"
	"log"
	"time"

	"github.com/arthur-fontaine/culty/jobs/media-scrapper/src/scrappers"
	treatimage "github.com/arthur-fontaine/culty/jobs/media-scrapper/src/treat-image"
	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
	mediadb "github.com/arthur-fontaine/culty/services/media-db/prisma/generated/clientgo"
)

func main() {
	env := utils.GetEnv()
	db := mediadb.NewClient(mediadb.WithDatasourceURL(env.MEDIA_DB_MONGO_URL))

	time.Sleep(time.Duration(env.MEDIA_MONGODB_INIT_SLEEP) * time.Second)

	if err := db.Connect(); err != nil {
		log.Fatalln("Failed to connect to MongoDB", err)
	}

	for media := range utils.MergeChan(scrappers.ScrapTMDB(env, db)) {
		alreadyExistsMedia, _ := db.Media.
			FindFirst(
				mediadb.Media.And(
					mediadb.Media.SourceID.Equals(media.SourceID),
					mediadb.Media.Source.Equals(media.Source),
				),
			).
			Select(mediadb.Media.ID.Field()).
			Exec(context.Background())

		alreadyExistsMediaID := ""
		if alreadyExistsMedia != nil {
			alreadyExistsMediaID = alreadyExistsMedia.ID
		}
		createdMedia, err := upsertMedia(db, alreadyExistsMediaID, media)

		if err != nil {
			log.Println("Failed to create media", err)
			continue
		}

		image, err := treatimage.TreatImage(env, media.Assets()[0].InnerMediaImage)

		if err != nil {
			log.Println("Failed to treat image", err)
			continue
		}

		_, err = db.MediaImage.CreateOne(
			mediadb.MediaImage.URL.Set(image.URL),
			mediadb.MediaImage.Thumbhash.Set(image.Thumbhash),
			mediadb.MediaImage.Width.Set(image.Width),
			mediadb.MediaImage.Height.Set(image.Height),
			mediadb.MediaImage.Media.Link(
				mediadb.Media.ID.Equals(createdMedia.ID),
			),
		).Exec(context.Background())

		if err != nil {
			log.Println("Failed to create media image", err)
			continue
		}
	}
}

func upsertMedia(
	db *mediadb.PrismaClient,
	id string,
	media mediadb.MediaModel,
) (*mediadb.MediaModel, error) {
	if id == "" {
		return db.Media.
			CreateOne(
				mediadb.Media.Title.Set(media.Title),
				mediadb.Media.Type.Set(media.Type),
				mediadb.Media.Description.Set(media.Description),
				mediadb.Media.ReleaseDate.Set(media.ReleaseDate),
				mediadb.Media.DurationInMinutes.Set(media.DurationInMinutes),
				mediadb.Media.Source.Set(media.Source),
				mediadb.Media.SourceID.Set(media.SourceID),
				mediadb.Media.Categories.Set(media.Categories),
			).
			Exec(context.Background())
	} else {
		return db.Media.
			UpsertOne(mediadb.Media.ID.Equals(id)).
			Update(
				mediadb.Media.Title.Set(media.Title),
				mediadb.Media.Description.Set(media.Description),
				mediadb.Media.ReleaseDate.Set(media.ReleaseDate),
				mediadb.Media.DurationInMinutes.Set(media.DurationInMinutes),
				mediadb.Media.Categories.Set(media.Categories),
			).
			Exec(context.Background())
	}
}

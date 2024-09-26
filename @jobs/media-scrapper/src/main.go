package main

import (
	"context"
	"log"
	"time"

	"github.com/arthur-fontaine/culty/jobs/media-scrapper/src/scrappers"
	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
	mediadb "github.com/arthur-fontaine/culty/services/media-db/prisma/generated/clientgo"
)

func main() {
	env := utils.GetEnv()
	db := mediadb.NewClient(mediadb.WithDatasourceURL(env.MEDIA_DB_MONGO_URL))

	time.Sleep(time.Duration(env.MONGODB_INIT_SLEEP) * time.Second)

	if err := db.Connect(); err != nil {
		log.Fatal(err)
	}

	for media := range utils.MergeChan(scrappers.ScrapTMDB(env, db)) {
		db.Media.CreateOne(
			mediadb.Media.Title.Set(media.Title),
			mediadb.Media.Type.Set(media.Type),
			mediadb.Media.Description.Set(media.Description),
			mediadb.Media.ReleaseDate.Set(media.ReleaseDate),
			mediadb.Media.Source.Set(media.Source),
			mediadb.Media.SourceID.Set(media.SourceID),
		).Exec(context.Background())
	}
}

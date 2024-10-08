package main

import (
	"context"
	"fmt"
	"log"
	"time"

	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
	typesenseutils "github.com/arthur-fontaine/culty/services/media-typesense/src"
	"github.com/arthur-fontaine/culty/services/media-typesense/types/go/mediatypesense"

	"github.com/typesense/typesense-go/v2/typesense"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	mongoOptions "go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	env := utils.GetEnv()

	// Connect to MongoDB
	mongoClient, err := getMongoClient(context.TODO(), env)
	if err != nil {
		log.Fatalln("Failed to connect to MongoDB", err)
	}

	defer mongoClient.Disconnect(context.TODO())

	// Connect to Typesense
	typesenseClient := typesenseutils.GetTypesenseClient(env)
	for i := 0; i < 10; i++ { // Retry 10 times
		typesenseIsUp, _ := typesenseClient.Health(context.TODO(), 10*time.Second)
		time.Sleep(1 * time.Second)
		if typesenseIsUp {
			break
		}
	}

	// Get the media change stream
	mediaChangeStream, err := getMediaChangeStream(context.TODO(), env, mongoClient)
	if err != nil {
		log.Fatalln("Failed to get media change stream", err)
	}
	defer mediaChangeStream.Close(context.TODO())

	// Handle media change
	handleMediaChange(context.TODO(), env, mediaChangeStream, mongoClient, typesenseClient)

	if err := mediaChangeStream.Err(); err != nil {
		log.Fatalln("Error while listening to media change stream", err)
	}
}

func getMongoClient(ctx context.Context, env utils.Env) (*mongo.Client, error) {
	mongodbClientOptions := mongoOptions.Client().
		ApplyURI("mongodb://localhost:" + env.MEDIA_MONGODB_PORT)
	mongodbClient, err := mongo.Connect(ctx, mongodbClientOptions)
	if err != nil {
		return nil, err
	}
	return mongodbClient, nil
}

func getMediaChangeStream(ctx context.Context, env utils.Env, mongoClient *mongo.Client) (*mongo.ChangeStream, error) {
	collection := mongoClient.Database(env.MEDIA_DB_NAME).Collection("Media")
	streamOptions := mongoOptions.ChangeStream().SetFullDocument(mongoOptions.UpdateLookup)
	changeStream, err := collection.Watch(ctx, mongo.Pipeline{}, streamOptions)
	if err != nil {
		return nil, err
	}
	return changeStream, nil
}

func handleMediaChange(
	ctx context.Context,
	env utils.Env,
	changeStream *mongo.ChangeStream,
	mongoClient *mongo.Client,
	typesenseClient *typesense.Client,
) {
	_, err := typesenseutils.UpsertTypesenseCollection(typesenseClient, *typesenseutils.GetMediaCollectionSchema(env))
	if err != nil {
		log.Fatalln("Failed to upsert media collection schema", err)
		return
	}

	typesenseMediaCollection := typesenseutils.GetMediaCollection(env, typesenseClient)

	for changeStream.Next(ctx) {
		var event bson.M
		if err := changeStream.Decode(&event); err != nil {
			log.Println("Error while decoding change stream event", err)
		}

		fullMediaDoc := event["fullDocument"].(bson.M)

		go func(fullMediaDoc primitive.M) {
			media, err := getMediaFromDocument(fullMediaDoc)
			if err != nil {
				log.Println("Error while getting media from document", err)
				return
			}

			mediaImage, err := getMediaImageForMediaId(ctx, mongoClient, media.Id)
			if err != nil {
				log.Println("Error while getting image media", media.Id, err, ". Continue because it is not important.")
			}
			media.Image = mediaImage

			operationType := event["operationType"]
			switch operationType {
			case "insert", "update":
				_, err := typesenseMediaCollection.Documents().Upsert(context.Background(), media)
				if err != nil {
					log.Println(fmt.Sprintf("Error while upserting media %s (%s:%s)", media.Id, media.Type, media.Title), err)
				} else {
					log.Printf("Upserted media %s (%s:%s)", media.Id, media.Type, media.Title)
				}
			case "delete":
				_, err := typesenseMediaCollection.Document(media.Id).Delete(context.Background())
				if err != nil {
					log.Println(fmt.Sprintf("Error while deleting media %s (%s:%s)", media.Id, media.Type, media.Title), err)
				} else {
					log.Printf("Deleted media %s (%s:%s)", media.Id, media.Type, media.Title)
				}
			}
		}(fullMediaDoc)
	}
}

func getMediaImageForMediaId(ctx context.Context, mongoClient *mongo.Client, mediaId string) (mediatypesense.Image, error) {
	mediaIDHex, err := primitive.ObjectIDFromHex(mediaId)
	if err != nil {
		return mediatypesense.Image{}, err
	}

	time.Sleep(3 * time.Second)

	mediaImageCollection := mongoClient.Database("media").Collection("MediaImage")
	mediaImageFilter := bson.M{"mediaID": mediaIDHex}

	secondsToWait := 5
	intervalBetweenCount := 0.5
	for i := 0; i < int(float64(secondsToWait)/intervalBetweenCount); i++ {
		numberOfImage, _ := mediaImageCollection.CountDocuments(ctx, mediaImageFilter)
		if numberOfImage > 0 {
			break
		}
		time.Sleep(time.Duration(intervalBetweenCount) * time.Millisecond)
	}

	mediaImageResult := mediaImageCollection.FindOne(ctx, mediaImageFilter)

	image := mediatypesense.Image{}
	if err := mediaImageResult.Decode(&image); err != nil {
		return mediatypesense.Image{}, err
	}

	return image, nil
}

func getMediaFromDocument(fullMediaDoc bson.M) (mediatypesense.Media, error) {
	return mediatypesense.Media{
		Id:          fullMediaDoc["_id"].(primitive.ObjectID).Hex(),
		Type:        mediatypesense.New_MediaType(mediatypesense.MediaType_Value(fullMediaDoc["type"].(string))),
		Title:       fullMediaDoc["title"].(string),
		Description: fullMediaDoc["description"].(string),
		Categories:  convertPrimitiveAtoStringSlice(fullMediaDoc["categories"].(primitive.A)),
		// The following line calculates the number of hours since the Unix epoch (1970-01-01 00:00:00 UTC)
		ReleaseDate: int(fullMediaDoc["releaseDate"].(primitive.DateTime).Time().Unix() / 3600),
	}, nil
}

func convertPrimitiveAtoStringSlice(a primitive.A) []string {
	strSlice := make([]string, len(a))
	for i, v := range a {
		strSlice[i] = v.(string)
	}
	return strSlice
}

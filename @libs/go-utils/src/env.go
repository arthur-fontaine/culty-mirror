package utils

import (
	"os"
	"strconv"
)

type Env struct {
	MEDIA_TYPESENSE_PORT                  string
	TYPESENSE_HOST                        string
	MEDIA_TYPESENSE_API_KEY               string
	MEDIA_TYPESENSE_MEDIA_COLLECTION_NAME string

	TMDB_API_KEY string

	MEDIA_MONGODB_PORT       string
	MEDIA_MONGODB_INIT_SLEEP int

	MEDIA_DB_NAME      string
	MEDIA_DB_MONGO_URL string

	SEARCH_SERVICE_PORT int
}

func GetEnv() Env {
	return Env{
		MEDIA_TYPESENSE_PORT:                  os.Getenv("MEDIA_TYPESENSE_PORT"),
		TYPESENSE_HOST:                        "http://localhost",
		MEDIA_TYPESENSE_API_KEY:               os.Getenv("MEDIA_TYPESENSE_API_KEY"),
		MEDIA_TYPESENSE_MEDIA_COLLECTION_NAME: os.Getenv("MEDIA_TYPESENSE_MEDIA_COLLECTION_NAME"),

		TMDB_API_KEY: os.Getenv("TMDB_API_KEY"),

		MEDIA_MONGODB_PORT:       os.Getenv("MEDIA_MONGODB_PORT"),
		MEDIA_MONGODB_INIT_SLEEP: getEnvAsInt("MEDIA_MONGODB_INIT_SLEEP"),

		MEDIA_DB_NAME:      os.Getenv("MEDIA_DB_NAME"),
		MEDIA_DB_MONGO_URL: os.Getenv("MEDIA_DB_MONGO_URL"),

		SEARCH_SERVICE_PORT: getEnvAsInt("SEARCH_SERVICE_PORT"),
	}
}

func getEnvAsInt(key string) int {
	value, err := strconv.Atoi(os.Getenv(key))
	if err != nil {
		panic("Environment variable " + key + " is not an integer")
	}
	return value
}

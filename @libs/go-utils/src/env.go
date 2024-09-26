package utils

import (
	"os"
	"strconv"
)

type Env struct {
	TYPESENSE_PORT                  string
	TYPESENSE_HOST                  string
	TYPESENSE_API_KEY               string
	TYPESENSE_MEDIA_COLLECTION_NAME string

	TMDB_API_KEY string

	MONGODB_PORT       string
	MONGODB_INIT_SLEEP int

	MONGODB_MEDIA_DB   string
	MEDIA_DB_MONGO_URL string

	SEARCH_SERVICE_PORT int
}

func GetEnv() Env {
	return Env{
		TYPESENSE_PORT:                  os.Getenv("TYPESENSE_PORT"),
		TYPESENSE_HOST:                  "http://localhost",
		TYPESENSE_API_KEY:               os.Getenv("TYPESENSE_API_KEY"),
		TYPESENSE_MEDIA_COLLECTION_NAME: os.Getenv("TYPESENSE_MEDIA_COLLECTION_NAME"),

		TMDB_API_KEY: os.Getenv("TMDB_API_KEY"),

		MONGODB_PORT:       os.Getenv("MONGODB_PORT"),
		MONGODB_INIT_SLEEP: getEnvAsInt("MONGODB_INIT_SLEEP"),

		MONGODB_MEDIA_DB:   os.Getenv("MONGODB_MEDIA_DB"),
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

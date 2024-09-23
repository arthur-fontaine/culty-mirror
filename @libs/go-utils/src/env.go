package utils

import (
	"os"
	"strconv"
)

type Env struct {
	TYPESENSE_PORT                  string
	TYPESENSE_HOST                  string
	TYPESENSE_KEY                   string
	TYPESENSE_MEDIA_COLLECTION_NAME string
	TMDB_API_KEY                    string
	SEARCH_SERVICE_PORT             int
}

func GetEnv() Env {
	return Env{
		TYPESENSE_PORT:                  os.Getenv("TYPESENSE_PORT"),
		TYPESENSE_HOST:                  "http://localhost",
		TYPESENSE_KEY:                   os.Getenv("TYPESENSE_KEY"),
		TYPESENSE_MEDIA_COLLECTION_NAME: os.Getenv("TYPESENSE_MEDIA_COLLECTION_NAME"),
		TMDB_API_KEY:                    os.Getenv("TMDB_API_KEY"),
		SEARCH_SERVICE_PORT:             getEnvAsInt("SEARCH_SERVICE_PORT"),
	}
}

func getEnvAsInt(key string) int {
	value, err := strconv.Atoi(os.Getenv(key))
	if err != nil {
		panic(err)
	}
	return value
}

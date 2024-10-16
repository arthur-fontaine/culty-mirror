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

	MEDIA_INTERACTIONS_POSTGRES_USER     string
	MEDIA_INTERACTIONS_POSTGRES_PASSWORD string
	MEDIA_INTERACTIONS_POSTGRES_DB_NAME  string
	MEDIA_INTERACTIONS_POSTGRES_PORT     string
	MEDIA_INTERACTIONS_DB_URL            string
	MEDIA_INTERACTIONS_DB_INIT_SLEEP     int

	ASSETS_PATH string

	SEARCH_SERVICE_PORT             int
	MEDIA_INTERACTIONS_SERVICE_PORT int
	MEDIA_SERVICE_PORT              int
	ASSETS_DOWNLOAD_SERVICE_PORT    int
	ASSETS_UPLOAD_SERVICE_PORT      int

	ASSETS_URL string
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

		MEDIA_INTERACTIONS_POSTGRES_USER:     os.Getenv("MEDIA_INTERACTIONS_POSTGRES_USER"),
		MEDIA_INTERACTIONS_POSTGRES_PASSWORD: os.Getenv("MEDIA_INTERACTIONS_POSTGRES_PASSWORD"),
		MEDIA_INTERACTIONS_POSTGRES_DB_NAME:  os.Getenv("MEDIA_INTERACTIONS_POSTGRES_DB_NAME"),
		MEDIA_INTERACTIONS_POSTGRES_PORT:     os.Getenv("MEDIA_INTERACTIONS_POSTGRES_PORT"),
		MEDIA_INTERACTIONS_DB_URL:            os.Getenv("MEDIA_INTERACTIONS_DB_URL"),
		MEDIA_INTERACTIONS_DB_INIT_SLEEP:     getEnvAsInt("MEDIA_INTERACTIONS_DB_INIT_SLEEP"),

		ASSETS_PATH: os.Getenv("ASSETS_PATH"),

		SEARCH_SERVICE_PORT:             getEnvAsInt("SEARCH_SERVICE_PORT"),
		MEDIA_INTERACTIONS_SERVICE_PORT: getEnvAsInt("MEDIA_INTERACTIONS_SERVICE_PORT"),
		MEDIA_SERVICE_PORT:              getEnvAsInt("MEDIA_SERVICE_PORT"),
		ASSETS_DOWNLOAD_SERVICE_PORT:    getEnvAsInt("ASSETS_DOWNLOAD_SERVICE_PORT"),
		ASSETS_UPLOAD_SERVICE_PORT:      getEnvAsInt("ASSETS_UPLOAD_SERVICE_PORT"),

		ASSETS_URL: os.Getenv("ASSETS_URL"),
	}
}

func getEnvAsInt(key string) int {
	value, err := strconv.Atoi(os.Getenv(key))
	if err != nil {
		panic("Environment variable " + key + " is not an integer")
	}
	return value
}

package utils

import (
	"time"

	"github.com/typesense/typesense-go/v2/typesense"
)

func GetTypesenseClient(env Env) *typesense.Client {
	typesenseClient := typesense.NewClient(
		typesense.WithServer(env.TYPESENSE_HOST+":"+env.TYPESENSE_PORT),
		typesense.WithAPIKey(env.TYPESENSE_KEY),
		typesense.WithConnectionTimeout(30*time.Second),
		typesense.WithNumRetries(3),
		typesense.WithRetryInterval(10*time.Second),
	)
	return typesenseClient
}

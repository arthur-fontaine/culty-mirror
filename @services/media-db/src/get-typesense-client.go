package typesenseutils

import (
	"time"

	"github.com/typesense/typesense-go/v2/typesense"

	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
)

func GetTypesenseClient(env utils.Env) *typesense.Client {
	typesenseClient := typesense.NewClient(
		typesense.WithServer(env.TYPESENSE_HOST+":"+env.TYPESENSE_PORT),
		typesense.WithAPIKey(env.TYPESENSE_KEY),
		typesense.WithConnectionTimeout(30*time.Second),
		typesense.WithNumRetries(3),
		typesense.WithRetryInterval(10*time.Second),
	)
	return typesenseClient
}

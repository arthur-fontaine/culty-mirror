module github.com/arthur-fontaine/culty/jobs/media-scrapper

go 1.22.5

require (
	github.com/apapsch/go-jsonmerge/v2 v2.0.0 // indirect
	github.com/cyruzin/golang-tmdb v1.6.7 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	github.com/oapi-codegen/runtime v1.1.1 // indirect
	github.com/palantir/go-metrics v1.1.0 // indirect
	github.com/palantir/pkg v1.1.0 // indirect
	github.com/palantir/pkg/bytesbuffers v1.0.0 // indirect
	github.com/palantir/pkg/metrics v1.0.0 // indirect
	github.com/palantir/pkg/retry v1.0.0 // indirect
	github.com/palantir/pkg/safejson v1.1.0 // indirect
	github.com/palantir/pkg/safeyaml v1.1.0 // indirect
	github.com/palantir/pkg/tlsconfig v1.0.0 // indirect
	github.com/palantir/pkg/transform v1.0.1 // indirect
	github.com/palantir/witchcraft-go-error v1.2.0 // indirect
	github.com/palantir/witchcraft-go-params v1.1.0 // indirect
	github.com/palantir/witchcraft-go-tracing v1.2.0 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/shopspring/decimal v1.4.0 // indirect
	github.com/sony/gobreaker v0.5.0 // indirect
	github.com/steebchen/prisma-client-go v0.41.0 // indirect
	github.com/typesense/typesense-go/v2 v2.0.0 // indirect
	golang.org/x/net v0.25.0 // indirect
	golang.org/x/text v0.16.0 // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
)

require github.com/arthur-fontaine/culty/libs/go-utils v0.0.0

replace github.com/arthur-fontaine/culty/libs/go-utils v0.0.0 => ./node_modules/culty-go-utils

require (
	github.com/arthur-fontaine/culty/services/media-db v0.0.0
	github.com/galdor/go-thumbhash v1.0.0
	github.com/palantir/conjure-go-runtime v1.0.0
	github.com/samber/lo v1.47.0
)

replace github.com/arthur-fontaine/culty/services/media-db v0.0.0 => ./node_modules/culty-media-db

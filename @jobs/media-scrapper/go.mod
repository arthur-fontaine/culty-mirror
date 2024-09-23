module github.com/arthur-fontaine/culty/jobs/media-scrapper

go 1.22.5

require (
	github.com/apapsch/go-jsonmerge/v2 v2.0.0 // indirect
	github.com/cyruzin/golang-tmdb v1.6.7 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	github.com/oapi-codegen/runtime v1.1.1 // indirect
	github.com/palantir/pkg v1.1.0 // indirect
	github.com/palantir/pkg/safejson v1.1.0 // indirect
	github.com/palantir/pkg/safeyaml v1.1.0 // indirect
	github.com/palantir/pkg/transform v1.0.1 // indirect
	github.com/sony/gobreaker v0.5.0 // indirect
	github.com/typesense/typesense-go/v2 v2.0.0 // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
)

require "github.com/arthur-fontaine/culty/services/media-db" v0.0.0
replace "github.com/arthur-fontaine/culty/services/media-db" v0.0.0 => "./node_modules/culty-media-db"

require "github.com/arthur-fontaine/culty/libs/go-utils" v0.0.0
replace "github.com/arthur-fontaine/culty/libs/go-utils" v0.0.0 => "./node_modules/culty-go-utils"

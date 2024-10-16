module github.com/arthur-fontaine/culty/services/media-typesense

go 1.22.5

require github.com/typesense/typesense-go/v2 v2.0.0

require (
	github.com/palantir/pkg v1.1.0 // indirect
	github.com/palantir/pkg/transform v1.0.1 // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
)

require (
	github.com/apapsch/go-jsonmerge/v2 v2.0.0 // indirect
	github.com/google/uuid v1.5.0 // indirect
	github.com/oapi-codegen/runtime v1.1.1 // indirect
	github.com/palantir/pkg/safejson v1.1.0
	github.com/palantir/pkg/safeyaml v1.1.0
	github.com/sony/gobreaker v0.5.0 // indirect
)

require "github.com/arthur-fontaine/culty/libs/go-utils" v0.0.0
replace "github.com/arthur-fontaine/culty/libs/go-utils" v0.0.0 => "./node_modules/culty-go-utils"

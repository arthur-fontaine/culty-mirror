module github.com/arthur-fontaine/culty/services/search-service

go 1.22.5

require github.com/palantir/pkg/datetime v1.1.0

require (
	github.com/apapsch/go-jsonmerge/v2 v2.0.0 // indirect
	github.com/golang/snappy v0.0.4 // indirect
	github.com/google/uuid v1.5.0 // indirect
	github.com/julienschmidt/httprouter v1.3.0 // indirect
	github.com/oapi-codegen/runtime v1.1.1 // indirect
	github.com/openzipkin/zipkin-go v0.2.2 // indirect
	github.com/palantir/conjure-go-runtime/v2 v2.77.0 // indirect
	github.com/palantir/go-encrypted-config-value v1.35.0 // indirect
	github.com/palantir/go-metrics v1.1.1 // indirect
	github.com/palantir/pkg/bytesbuffers v1.2.0 // indirect
	github.com/palantir/pkg/metrics v1.7.0 // indirect
	github.com/palantir/pkg/refreshable v1.5.0 // indirect
	github.com/palantir/pkg/refreshable/v2 v2.0.0 // indirect
	github.com/palantir/pkg/retry v1.2.0 // indirect
	github.com/palantir/pkg/safejson v1.1.0 // indirect
	github.com/palantir/pkg/safelong v1.1.0 // indirect
	github.com/palantir/pkg/safeyaml v1.1.0 // indirect
	github.com/palantir/pkg/signals v1.1.0 // indirect
	github.com/palantir/pkg/tlsconfig v1.3.0 // indirect
	github.com/palantir/pkg/transform v1.1.0 // indirect
	github.com/palantir/pkg/uuid v1.2.0 // indirect
	github.com/palantir/witchcraft-go-error v1.38.0 // indirect
	github.com/palantir/witchcraft-go-health v1.15.0 // indirect
	github.com/palantir/witchcraft-go-logging v1.56.0 // indirect
	github.com/palantir/witchcraft-go-params v1.35.0 // indirect
	github.com/palantir/witchcraft-go-tracing v1.37.0 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/sony/gobreaker v0.5.0 // indirect
	go.uber.org/atomic v1.6.0 // indirect
	go.uber.org/multierr v1.5.0 // indirect
	go.uber.org/zap v1.15.0 // indirect
	golang.org/x/net v0.28.0 // indirect
	golang.org/x/text v0.17.0 // indirect
	google.golang.org/protobuf v1.33.0 // indirect
	gopkg.in/natefinch/lumberjack.v2 v2.0.0 // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

require (
	github.com/palantir/pkg v1.1.0 // indirect
	github.com/palantir/witchcraft-go-server/v2 v2.83.0
	github.com/samber/lo v1.47.0
	github.com/typesense/typesense-go/v2 v2.0.0
)

require "github.com/arthur-fontaine/culty/services/media-db" v0.0.0
replace "github.com/arthur-fontaine/culty/services/media-db" v0.0.0 => "./node_modules/culty-media-db"

require "github.com/arthur-fontaine/culty/libs/go-utils" v0.0.0
replace "github.com/arthur-fontaine/culty/libs/go-utils" v0.0.0 => "./node_modules/culty-go-utils"

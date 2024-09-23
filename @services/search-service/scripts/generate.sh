rm -rf .conjure types

mkdir -p .conjure

conjure compile types.conjure.yml .conjure/types.conjure.json

mkdir -p types/typescript
conjure-typescript generate --rawSource .conjure/types.conjure.json types/typescript

mkdir -p types/go
conjure-go --server --output types/go .conjure/types.conjure.json

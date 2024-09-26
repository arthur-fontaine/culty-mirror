rm -rf .conjure types

mkdir -p .conjure

conjure compile types.conjure.yml .conjure/types.conjure.json

conjure-go --server --output types/go .conjure/types.conjure.json

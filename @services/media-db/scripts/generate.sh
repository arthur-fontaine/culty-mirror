mkdir -p .conjure

conjure compile types.conjure.yml .conjure/types.conjure.json

go mod init temporary
conjure-go --server --output types/go .conjure/types.conjure.json
rm go.mod

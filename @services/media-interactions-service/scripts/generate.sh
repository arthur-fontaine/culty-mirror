rm -rf .conjure types

mkdir -p .conjure

conjure compile types.conjure.yml .conjure/types.conjure.json

mkdir -p types/typescript
conjure-typescript generate --rawSource .conjure/types.conjure.json types/typescript

# The following command is used to convert interfaces to types in typescript
# Because interfaces don't extends JsonValue (which is required for Agrume)
find types/typescript -type f -exec sed -i '' 's/interface \([^ ]*\) {/type \1 = {/g' {} +

mkdir -p types/go
conjure-go --server --output types/go .conjure/types.conjure.json

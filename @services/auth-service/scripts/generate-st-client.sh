ST_API_YAML_URL="https://app.swaggerhub.com/apiproxy/registry/supertokens/CDI/5.1.1?resolved=true&flatten=true"
ST_API_YAML_FILE="st-api.yaml"

curl -o "$ST_API_YAML_FILE" "$ST_API_YAML_URL" --silent

sed -i '' -E 's/<([^>]+)>/{\1}/g;t' "$ST_API_YAML_FILE"

pnpx openapi-typescript "$ST_API_YAML_FILE" \
  --properties-required-by-default \
  --exclude-deprecated \
  --output ./src/supertokens-core-api/schema.d.ts

rm "$ST_API_YAML_FILE"

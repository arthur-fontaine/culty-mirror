import * as z from 'zod';

const envSchema = z.object({
  MEDIA_TYPESENSE_PORT: z.string(),
  TYPESENSE_HOST: z.string(),
  MEDIA_TYPESENSE_API_KEY: z.string(),
  MEDIA_TYPESENSE_MEDIA_COLLECTION_NAME: z.string(),

  TMDB_API_KEY: z.string(),

  MEDIA_MONGODB_PORT: z.string(),
  MEDIA_MONGODB_INIT_SLEEP: z.coerce.number(),

  MEDIA_DB_NAME: z.string(),
  MEDIA_DB_MONGO_URL: z.string(),

  MEDIA_INTERACTIONS_POSTGRES_USER: z.string(),
  MEDIA_INTERACTIONS_POSTGRES_PASSWORD: z.string(),
  MEDIA_INTERACTIONS_POSTGRES_DB_NAME: z.string(),
  MEDIA_INTERACTIONS_POSTGRES_PORT: z.string(),
  MEDIA_INTERACTIONS_DB_URL: z.string(),
  MEDIA_INTERACTIONS_DB_INIT_SLEEP: z.coerce.number(),

  ASSETS_PATH: z.string(),

  SEARCH_SERVICE_PORT: z.coerce.number(),
  MEDIA_INTERACTIONS_SERVICE_PORT: z.coerce.number(),
  MEDIA_SERVICE_PORT: z.coerce.number(),
  ASSETS_DOWNLOAD_SERVICE_PORT: z.coerce.number(),
  ASSETS_UPLOAD_SERVICE_PORT: z.coerce.number(),
  SUPER_TOKENS_PORT: z.coerce.number(),
  SUPER_TOKENS_DB_PORT: z.coerce.number(),
  AUTH_SERVICE_PORT: z.coerce.number(),

  ASSETS_URL: z.string(),
});

export const env = envSchema.parse(process.env);

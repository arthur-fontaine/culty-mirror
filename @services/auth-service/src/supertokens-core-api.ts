import { env } from '@culty/ts-utils';
import type { paths as supertokensCoreApiPaths } from './supertokens-core-api/schema';
import createClient from "openapi-fetch";

export const supertokensCoreApi = createClient<supertokensCoreApiPaths>({
  baseUrl: `http://localhost:${env.SUPER_TOKENS_PORT}`,
});

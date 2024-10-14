import { env } from '@culty/ts-utils';
import { serve } from '@hono/node-server';
import { ConjureServer } from 'conjure-ts-server';
import { AuthService } from '../types/typescript';
import { loginEmailPassword } from './functions/login-email-password';
import { refreshToken } from './functions/refresh-token';
import { signUpEmailPassword } from './functions/signup-email-password';
import { verifyAccessToken } from './functions/verify-access-token';

const server = new ConjureServer(AuthService, {
  loginEmailPassword,
  signUpEmailPassword,
  refreshToken,
  verifyAccessToken,
})

serve({
  fetch: server.server.fetch,
  port: env.AUTH_SERVICE_PORT,
});

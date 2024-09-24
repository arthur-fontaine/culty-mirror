import { defineConfig } from '@agrume/cli';

const ngrokDomain = process.env['NGROK_DOMAIN'];

if (!ngrokDomain) {
  throw new Error('NGROK_DOMAIN is not set');
}

export default defineConfig({
  corsRegex: /^https?:\/\/localhost(:\d+)?$/,
  tunnel: {
    type: 'ngrok',
    domain: ngrokDomain,
  },
});

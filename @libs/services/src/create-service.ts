import { DefaultHttpApiBridge, type IHttpApiBridge } from 'conjure-client';

export const createService = <T>(
  service: new (bridge: IHttpApiBridge) => T,
  portEnvVar: string,
) => {
  console.log('created service with port env var:', portEnvVar);
  // @ts-expect-error
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  return new service(new DefaultHttpApiBridge({
    baseUrl: `https://localhost:${process.env[portEnvVar]}`,
    userAgent: {
      productName: 'example',
      productVersion: '1.0.0',
    },
  }))
}

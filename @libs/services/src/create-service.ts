import { DefaultHttpApiBridge, type IHttpApiBridge } from 'conjure-client';

export const createService = <T>(
  Service: new (bridge: IHttpApiBridge) => T,
  portEnvVar: string,
  ssl = true
) => {
  console.log('created service with port env var:', portEnvVar);
  // @ts-expect-error
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const service = new Service(new DefaultHttpApiBridge({
    baseUrl: `http${ssl ? 's' : ''}://localhost:${process.env[portEnvVar]}`,
    userAgent: {
      productName: 'example',
      productVersion: '1.0.0',
    },
  }))

  return new Proxy({}, {
    get: (_, key) => {
      const method = service[key as keyof T];
      if (typeof method !== 'function') {
        return method;
      }
      // Always bind the method to the service instance (allow to call with `createRoute(service.method)`)
      const fn = (...args: never[]) => {
        return method.apply(service, args);
      };
      Object.defineProperty(fn, 'name', { value: key });
      return fn;
    }
  }) as typeof service;
}

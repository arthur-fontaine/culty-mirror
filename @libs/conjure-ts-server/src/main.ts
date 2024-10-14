import { type IHttpApiBridge, type IHttpEndpointOptions, MediaType } from 'conjure-client';
import { Hono } from 'hono'

type ConjureService<T> = T;
type ConjureServiceConstructor<T> = new (bridge: IHttpApiBridge) => ConjureService<T>;

export class ConjureServer<CS extends ConjureServiceConstructor<T>, T = CS extends ConjureServiceConstructor<infer U> ? U : never> {
  private hono = new Hono();
  private service: ConjureService<T>;

  public log: ConjureServerBridge['log'];

  constructor(Service: CS, impls: { [K in keyof NoInfer<T>]: T[K] }) {
    const bridge = new ConjureServerBridge(this.hono);
    this.service = new Service(bridge);
    this.init(impls);
    this.log = bridge.log.bind(bridge);
  }

  private init(impls: { [K in keyof T]: T[K] }) {
    for (const methodName of Object.getOwnPropertyNames(Object.getPrototypeOf(this.service))) {
      if (methodName === 'constructor') {
        continue;
      }
      // @ts-ignore
      this.service[methodName](impls[methodName]);
    }
  }

  get server() {
    return this.hono;
  }
}

class ConjureServerBridge implements IHttpApiBridge {
  private serviceName: string | undefined;

  constructor(private hono: Hono) { }

  callEndpoint<T>(parameters: IHttpEndpointOptions): Promise<T> {
    this.serviceName = parameters.serviceName;

    const honoRegisterFn = this.getHonoRegisterFn(parameters);
    honoRegisterFn(parameters.endpointPath, async (c) => {
      const data = await c.req.json();
      const result = await parameters.data(data);
      return c.text(this.encode(result, parameters.responseMediaType ?? MediaType.APPLICATION_JSON));
    })

    this.log(`Registered endpoint ${parameters.method} ${parameters.endpointPath}`);

    return {} as never;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public log(message: any) {
    console.log(`[${this.serviceName}]`, message);
  }

  private getHonoRegisterFn(parameters: IHttpEndpointOptions) {
    const method = parameters.method.toLowerCase();
    switch (method) {
      case 'post': return this.hono.post;
      case 'get': return this.hono.get;
      case 'put': return this.hono.put;
      case 'delete': return this.hono.delete;
      case 'patch': return this.hono.patch;
      default: throw new Error(`Unexpected method ${parameters.method}`);
    }
  }

  call<T>(
    serviceName: string,
    endpointName: string,
    method: string,
    endpointPath: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    data?: any,
    headers?: { [header: string]: string | number | boolean | undefined | null; },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    queryArguments?: { [paramName: string]: any; },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    pathArguments?: any[],
    requestMediaType?: string,
    responseMediaType?: string
  ): Promise<T> {
    return this.callEndpoint({
      serviceName,
      endpointName,
      method,
      endpointPath,
      data,
      headers: headers == null ? {} : headers,
      requestMediaType:
        requestMediaType == null ? MediaType.APPLICATION_JSON : this.getMediaType(requestMediaType),
      responseMediaType:
        responseMediaType == null ? MediaType.APPLICATION_JSON : this.getMediaType(responseMediaType),
      queryArguments: queryArguments == null ? {} : queryArguments,
      pathArguments: pathArguments == null ? [] : pathArguments,
      binaryAsStream: true,
    });
  }

  private getMediaType(value: string): MediaType {
    if (value === MediaType.APPLICATION_JSON) {
      return MediaType.APPLICATION_JSON;
    }
    if (value === MediaType.APPLICATION_OCTET_STREAM) {
      return MediaType.APPLICATION_OCTET_STREAM;
    }
    if (value === MediaType.APPLICATION_X_WWW_FORM_URLENCODED) {
      return MediaType.APPLICATION_X_WWW_FORM_URLENCODED;
    }
    if (value === MediaType.MULTIPART_FORM_DATA) {
      return MediaType.MULTIPART_FORM_DATA;
    }
    if (value === MediaType.TEXT_PLAIN) {
      return MediaType.TEXT_PLAIN;
    }
    throw new Error(`Unexpected media type ${value}`);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private encode(data: any, mediaType: MediaType): string {
    if (mediaType === MediaType.APPLICATION_JSON) {
      return JSON.stringify(data);
    }
    if (mediaType === MediaType.APPLICATION_X_WWW_FORM_URLENCODED) {
      return new URLSearchParams(data).toString();
    }
    if (mediaType === MediaType.TEXT_PLAIN) {
      return data;
    }
    throw new Error(`Unexpected media type ${mediaType}`);
  }
}

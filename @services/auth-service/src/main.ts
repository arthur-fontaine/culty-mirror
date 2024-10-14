import { env } from "@culty/ts-utils";
import cors from "@fastify/cors";
import formDataPlugin from "@fastify/formbody";
import Fastify from "fastify";
import supertokens from "supertokens-node";
import * as supertokensFastify from "supertokens-node/framework/fastify";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { name as appName } from '../../../package.json';

supertokens.init({
  framework: "fastify",
  supertokens: {
    connectionURI: `http://localhost:${env.SUPER_TOKENS_PORT}`,
  },
  appInfo: {
    appName,
    apiDomain: `http://localhost:${env.SUPER_TOKENS_SERVICE_PORT}`,
    websiteDomain: "https://localhost:3000", // TODO: change this to the actual website domain
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    EmailPassword.init(),
    Session.init(),
  ]
});

const fastify = Fastify();

fastify.setErrorHandler(supertokensFastify.errorHandler() as never);

fastify.register(cors, {
  origin: true, // TODO: maybe change this to a list of allowed origins
  allowedHeaders: ['Content-Type', ...supertokens.getAllCORSHeaders()],
  credentials: true,
});

await fastify.register(formDataPlugin);
await fastify.register(supertokensFastify.plugin);

await fastify.listen(
  { port: env.SUPER_TOKENS_SERVICE_PORT },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address.replace("[::1]", "localhost")}`);
  }
);

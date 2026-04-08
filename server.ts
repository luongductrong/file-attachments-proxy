import path from "path";
import Fastify from "fastify";
import { fileURLToPath } from "url";
import Static from "@fastify/static";
import httpProxy from "@fastify/http-proxy";
import { UPSTREAM_URL, PORT } from "./app-constant.js";

const fastify = Fastify({ logger: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fastify.register(httpProxy, {
  upstream: UPSTREAM_URL,
  prefix: "/api",
  rewritePrefix: "",
  replyOptions: {
    rewriteRequestHeaders: (_request, headers) => {
      const upstream = new URL(UPSTREAM_URL);

      return {
        ...headers,
        host: upstream.host,
        origin: upstream.origin,
        referer: upstream.origin + "/",
      };
    },
  },
});

fastify.register(Static, {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

fastify.listen({ port: PORT });

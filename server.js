import { ServerConfig } from "./config"; // <==  ES6 mdules

async function main() {
  const PORT = process.env.PORT || 3000;
  const server = new ServerConfig({
    port: PORT,
    // middlewares: [],
    // routers: []
  })
  server.listen();
}
main();

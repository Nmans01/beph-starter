import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { oauthService } from "./modules/integrations/oauthService";
import { apiRoutes } from "./routes/apiRoutes";
import { pageRoutes } from "./routes/pageRoutes";
import { staticRoutes } from "./routes/staticRoutes";

// build the server
export const app = new Elysia()
  // .use(corsConfig)
  .use(swagger())

  .use(oauthService)
  // .use(refreshController)

  // mount top-level routes
  .use(staticRoutes)
  .use(apiRoutes)
  .use(pageRoutes)

// start the server
app.listen(3000);

console.log(`✨ BEPH-Starter is running at ${app.server?.hostname}:${app.server?.port} ✨`, "\nTime is now", new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
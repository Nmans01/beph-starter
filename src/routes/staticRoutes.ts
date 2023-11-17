import Elysia from "elysia";

export const staticRoutes = new Elysia({ prefix: "/public" })
  .get("/js/:file", async ({ params: { file } }) => await Bun.file(`public/js/${file}`))
  .get("/img/:file", async ({ params: { file } }) => await Bun.file(`public/img/${file}`))
  .get("/css/:file", async ({ params: { file } }) => await Bun.file(`public/css/${file}`))

// .use(staticPlugin({
//   assets: "public/js",
//   prefix: "public/js",
//   headers: { "Cache-Control": "max-age=604800" },
// }))
// .use(staticPlugin({
//   assets: "public/img",
//   prefix: "public/img",
//   headers: { "Cache-Control": "max-age=604800" },
// }))
// .use(staticPlugin({
//   assets: "public/css",
//   prefix: "public/css",
// }));

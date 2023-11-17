import { swagger } from "@elysiajs/swagger";
import Elysia from "elysia";

export const swaggerController = new Elysia()
  .use(swagger())
    //   {
    //   // exclude: pageRoutes.routes.map((route) => route.path),
    //   // documentation: {
    //   //   info: {
    //   //     title: "Darius-Starter API",
    //   //     description: "API Documentation for Darius-Starter",
    //   //     version: "1.0.0",
    //   //   },
    //   //   // tags: [
    //   //   //   { name: "HTMX", description: "HTMX Endpoints - These return HTML", },
    //   //   // ],
    //   // },
    // }
  // ))
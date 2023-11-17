import { Elysia } from "elysia";
import cors from "@elysiajs/cors";

export const corsConfig = new Elysia()
  .use(cors({
    origin: process.env.corsOrigin ?? "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "HX-Boosted",
      "HX-Current-URL",
      "HX-History-Restore-Request",
      "HX-Prompt",
      "HX-Request",
      "HX-Target",
      "HX-Trigger-Name",
      "HX-Trigger",
      "Set-Cookie",
    ],
    exposedHeaders: [
      "Content-Type",
      "Authorization",
      "HX-Location",
      "HX-Push-Url",
      "HX-Redirect",
      "HX-Refresh",
      "HX-Replace-Url",
      "HX-Reswap",
      "HX-Retarget",
      "HX-Reselect",
      "HX-Trigger",
      "HX-Trigger-After-Settle",
      "HX-Trigger-After-Swap",
      "Set-Cookie",
    ],
    credentials: true,
    maxAge: 3600,
  }));

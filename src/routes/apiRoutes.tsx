import { html } from "@elysiajs/html";
import Elysia from "elysia";
import { countController } from "../modules/count/countController";
import { chatController } from "../modules/chat/chatController";
import { filesController } from "../modules/files/filesController";
import { authController } from "../modules/auth/authController";

export const apiRoutes = new Elysia({ prefix: "/api/htmx" })
  .use(html())

  .get("/hello", () => <p id="hello">Hi! This HTML was sent from the server!</p>,
    { detail: { tags: ["HTMX"], }, })

  .use(countController)
  .use(chatController)
  .use(filesController)
  .use(authController)
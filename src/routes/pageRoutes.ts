import { html } from "@elysiajs/html";
import Elysia from "elysia";
import { authPages } from "../modules/auth/authPages";
import { chatPage } from "../modules/chat/chatPage";
import { NotFound } from "../modules/common/components/NotFound";
import { countPage } from "../modules/count/countPage";
import { filesPages } from "../modules/files/filesPages";
import { homePages } from "../modules/home/homePages";

export const pageRoutes = new Elysia()
  // @ts-ignore idk
  .use(html())
  .use(homePages)
  .get("/counter", countPage)
  .get("/chat", chatPage)
  .use(filesPages)
  .use(authPages)
  .get("/*", NotFound)
import Elysia from "elysia";
import { filesPage } from "./pages/filesPage";

export const filesPages = new Elysia({ prefix: "/files" })
    .get("", filesPage)

import Elysia, { t } from "elysia";
import { oauthService } from "../integrations/oauthService";
import { HomePage } from "./homePage";

export const homePages = new Elysia()
    .use(oauthService)
    .get("/", () => HomePage({}),
    )
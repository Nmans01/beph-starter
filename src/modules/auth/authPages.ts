import Elysia, { t } from "elysia";
import { Login, Register } from "./pages/Login";
import { oauthService } from "../integrations/oauthService";
import { randomUUID } from "crypto";

export const authPages = new Elysia()
    .use(oauthService)
    .get("/login", ({ profiles, set }) => {

        return Response.redirect(profiles().github.login);

        set.cookie = { oauthSession: { value: JSON.stringify({ user_id: randomUUID() }) } }
        return Login({ githubURL: profiles().github.login });
    })
    .get("/register", async ({ onOauthReturn }) => {
        const { stub, redirectResponse } = await onOauthReturn();
        if (redirectResponse) return redirectResponse;
        return Register(stub);
    }, {
        error: ({ error }) => "Caught: " + error.message
    })
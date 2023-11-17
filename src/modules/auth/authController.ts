import Elysia, { t } from "elysia";
import { authService } from "./authService";
import { Account } from "./components/Account";

export const authController = new Elysia({
    prefix: "/auth",
    cookie: {
        secrets: 'Fischl von Luftschloss Narfidort',
        sign: ['profile']
    }
})
    .use(authService)

    .post("/register", async ({ body, createUserByOauth, cookie: { session } }) => {
        const { auth_session } = await createUserByOauth(body);
        session.value = auth_session;
        return "success";
    }, {
        body: t.Object({
            firstName: t.String(),
            lastName: t.String(),
            email: t.String(),
            provider: t.String(),
            id_from_provider: t.String(),
        }), cookie: "sessionCookie",
        error: ({ error, set }) => {
            set.status = 200;
            return error.message;
        }
    })

    .post("/login", async ({ body, loginByEmail, cookie: { session }, set }) => {
        const { auth_session } = await loginByEmail(body);
        session.value = auth_session;
        console.log(session.value);
        set.headers = { "HX-Redirect": "/" };
        return "success";
    }, {
        body: "loginAttributes", cookie: "sessionCookie",
        error: ({ error, set }) => {
            set.status = 200;
            return "Error: " + error.message;
        }
    })

    .get("/resource", async ({ cookie: { session } }) => {
        console.log(session.value.user_id, " is accessing resource");
    }, { cookie: "sessionCookie" })

    .get("/status", async ({ cookie: { session }, prisma }) => {
        const res = session.value && await prisma.user.findUniqueOrThrow({ where: { id: session.value.user_id } });
        return Account({ name: res?.firstName });
    }, { cookie: "sessionCookieOptional" })

    .post("/logout", async ({ cookie: { session }, logOut }) => {
        await logOut(session.value);
        session.remove();
        return Account({ name: undefined });
    })
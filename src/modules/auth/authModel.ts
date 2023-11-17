import { Session } from "@prisma/client";
import Elysia, { t } from "elysia";

export const authModel = new Elysia()
    .model({
        "createUserAttributes": t.Object({
            email: t.String(),
            firstName: t.String(),
            lastName: t.String(),
            password: t.String()
        }),
        "loginAttributes": t.Object({
            email: t.String(),
            password: t.String()
        }),
        "sessionCookie": t.Cookie({
            session: t.Object({
                id: t.String(),
                user_id: t.String(),
                created_at: t.Date(),
            } satisfies { [K in keyof Session]: any })
        }),
        "sessionCookieOptional": t.Cookie({
            session: t.Optional(t.Object({
                id: t.String(),
                user_id: t.String(),
                created_at: t.Date(),
            } satisfies { [K in keyof Session]: any }))
        })
    });

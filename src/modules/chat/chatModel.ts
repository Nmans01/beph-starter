import Elysia, { t } from "elysia";

export const chatModel = new Elysia()
    .model({
        "chat": t.Object({
            id: t.String(),
            name: t.String(),
            message: t.String(),
            time: t.String()
        })
    });

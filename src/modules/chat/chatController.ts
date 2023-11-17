import Elysia, { t } from "elysia";
import { chatModel } from "./chatModel";
import { chatService } from "./chatService";
import { Chat } from "./components/Chat";

export const chatController = new Elysia({ prefix: "/chat" })
    .use(chatService)
    .use(chatModel)

    .ws("", {
        query: t.Object({ room: t.String(), name: t.String() }),
        body: t.Object({
            message: t.String(),
            HEADERS: t.Any()
        }),
        open: ws => {
            const { name, room } = ws.data.query;
            const count = ws.data.addConx(room, name, ws as any);
            console.log("chat: ws opened -", name, "Total:", count,);
        },
        message: (ws, { message }) => {
            console.log("message received from ", ws.data.query.name, ": ", message);
            ws.data.receiveMessage(ws.data.query.room, {
                name: Bun.escapeHTML(ws.data.query.name),
                message: Bun.escapeHTML(message),
                time: new Date().toLocaleTimeString()
            });
        },
        close: ws => {
            const { name, room } = ws.data.query;
            const count = ws.data.rmConx(room, ws as any);
            console.log("chat: ws closed -", name, "Total:", count);
        }
    })

    .post("/join", ({ body }) => {
        return Chat(body)
    }, { body: t.Object({ name: t.String(), room: t.String() }) })
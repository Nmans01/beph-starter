import Elysia, { t } from "elysia";
import { countService } from "./countService";

export const countController = new Elysia({ prefix: "/count" })
    .use(countService)

    .model({
        "message": t.Object({
            message: t.String(),
            HEADERS: t.Any()
        })
    })

    .ws("/ws", {
        open: ws => {
            ws.send(ws.data.getCount());
            console.log("count: ws opened");
            ws.subscribe("broadcast");
        },
        message: async (ws, { message }) => {
            // Message must be "inc" or "dec"
            if (message !== "inc" && message !== "dec") return;

            const output = message === "inc"
                ? await ws.data.incrementCount()
                : await ws.data.decrementCount();

            ws.send(output);
            ws.publish("broadcast", output);
        },
        close: ws => {
            ws.unsubscribe("broadcast");
            console.log("count: ws closed");
        },
        body: "message"
    })
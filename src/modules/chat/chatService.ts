import Elysia from "elysia";
import { ElysiaWS } from "elysia/dist/ws";
import { ChatConversation } from "./components/Chat";

export type Message = { name: string, message: string, time: string };

type Room = {
    connections: [string, ElysiaWS<any, any>][],
    messages: Message[]
};

export const chatService = new Elysia()
    .state({ rooms: {} as Record<string, Room> })

    .derive(({ store }) => ({
        getLatest: (room: string) => store.rooms[room].messages.slice(-5),

        rmConx: (room: string, conx: ElysiaWS<any, any>) => {
            if (!(room in store.rooms)) return; // or throw error
            store.rooms[room].connections = store.rooms[room].connections
                .filter(([_, c]) => c.id !== conx.id);
            if (!store.rooms[room].connections.length) {
                delete store.rooms[room];
                return 0
            };
            return store.rooms[room].connections.length;
        },
    }))
    .derive(({ store, getLatest }) => ({

        addConx: (room: string, name: string, conx: ElysiaWS<any, any>) => {
            if (room in store.rooms) store.rooms[room].connections.push([name, conx])
            else store.rooms[room] = { connections: [[name, conx]], messages: [] };

            conx.send(ChatConversation({ messages: getLatest(room), name }))

            return store.rooms[room].connections.length;
        },

        dispatchMessages: (room: string) =>
            store.rooms[room].connections.forEach(([name, conx]) => conx.send(
                ChatConversation({ messages: getLatest(room), name })
            )),
    }))
    .derive(({ store, dispatchMessages }) => ({
        receiveMessage: (room: string, message: Message) => {
            if (!(room in store.rooms)) return;

            store.rooms[room].messages.push(message);
            if (store.rooms[room].messages.length > 10)
                store.rooms[room].messages.shift();

            dispatchMessages(room);
        }
    }))
import { For } from "../../common/components/primitives/For";
import { Component } from "../../common/components/types";
import { Message } from "../chatService";

export const JoinChat: Component<{}> = (props) => <>
    <form hx-post="/api/htmx/chat/join" hx-swap="outerHTML" class="p-4 bg-black/95 rounded-md border-2 border-white/40 flex flex-col gap-2">
        <input name="name" placeholder="Enter your name..." class="input" />
        <input name="room" placeholder="Enter a room..." class="input" />
        <button type="submit" class="btn btn-secondary">
            Join
        </button>
    </form>
</>;

export const Chat: Component<{ name: string, room: string }> = (props) => <>
    <div id="chat" hx-ext="ws" ws-connect={`/api/htmx/chat?room=${props.room}&name=${props.name}`} class="p-1 bg-gray-800 rounded-md border-2 border-white/60 flex flex-col gap-2">
        <div id="chatBubbles" />
        <form hx-ext="ws" ws-send class="flex gap-2">
            <input name="message" placeholder="Send a message..." class="input" />
            <button type="submit" class="btn btn-secondary">
                Send
            </button>
        </form>
    </div>
</>;

// TODO: use morphdom to update the chat bubbles instead of re-rendering the whole thing
export const ChatConversation: Component<{ messages: Message[], name: string }> = (props) => <>
    <div id="chatBubbles" class="bg-white flex flex-col justify-end gap-2 p-4 rounded-sm">
        <For each={props.messages} children={(message) =>
            <MessageComp in={message.name !== props.name} {...message} />
        } />
    </div>
</>;

const MessageComp: Component<Message & { in: boolean }> = (props) => <>
    <div class={"flex w-48 flex-col " + (!props.in ? "self-end items-end" : " self-start items-start")}>
        <div>
            <span class="text-xs text-black/80">{props.name}</span> / <span class="text-xs">{props.time}</span>
        </div>
        <div class={" text-white rounded-lg p-1 px-2 " + (!props.in ? "bg-blue-400  rounded-br-none" : "bg-red-400  rounded-bl-none")}>{props.message}</div>
    </div>
</>;
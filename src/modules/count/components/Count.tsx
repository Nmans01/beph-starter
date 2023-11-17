import { ParentComponent } from "@/modules/common/components/types";
import { Component } from "@/modules/common/components/types";

export const Count: Component<{}> = (props) => <>
    <div hx-ext="ws" ws-connect="/api/htmx/count/ws" class="flex-row flex gap-2 justify-center items-center text-center">
        <MessageButton message="dec">-</MessageButton>
        <MessageButton message="inc">+</MessageButton>
        <p id="countfromserver">...</p>
    </div>
</>;

/**
 * Sends a message on button-press via the nearest parent websocket container.
 */
const MessageButton: ParentComponent<{ message: string }> = (props) => <>
    <form hx-ext="ws" ws-send >
        <input type="hidden" name="message" value={props.message} />
        <button type="submit" class="btn btn-secondary">
            {props.children}
        </button>
    </form>
</>;
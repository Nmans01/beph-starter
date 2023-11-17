import { Page } from "../common/components/Page";
import { Component } from "../common/components/types";
import { JoinChat } from "./components/Chat";

export const chatPage: Component<{}> = (props) => <>
    <Page ws>
        <h2 class="text-xl">Websocket Chat Demo:</h2>
        <JoinChat />
    </Page>
</>
import { Page } from "../common/components/Page";
import { Component } from "../common/components/types";
import { Count } from "./components/Count";

export const countPage: Component<{}> = (props) => <>
    <Page ws>
        <h2 class="text-xl">Websocket Counter Demo:</h2>
        <Count />
    </Page>
</>
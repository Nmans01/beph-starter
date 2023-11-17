import { Page } from "../../common/components/Page";
import { Component } from "../../common/components/types";

export const filesPage: Component<{}> = (props) => <>
    <Page>
        <h2>File Upload Demo</h2>
        <form hx-post="/api/htmx/files" hx-encoding='multipart/form-data' hx-swap="outerhtml" >
            <input type="file" name="file" />
            <button type="submit">Upload</button>
        </form>
    </Page>
</>;
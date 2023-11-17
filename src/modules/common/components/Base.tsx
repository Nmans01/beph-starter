import { ParentComponent } from "./types";

/** Base HTML template. */
export const Base: ParentComponent<{
    /** JSX to insert into head tag. */
    head?: JSX.Element,
    /** String to insert into title tag. Defaults to "BEPH-Starter". */
    title?: string,
    /** Include websocket HTMX extention. */
    ws?: true
}> = (props) => <>
    <html lang="en" class="h-full w-full fixed overflow-y-auto">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            {/* Styles + Icon */}
            <link rel="icon" type="image/x-icon" href="/public/img/favicon.ico" />
            <link rel="stylesheet" href="/public/css/styles.css" />

            {/* Scripts */}
            <script src="/public/js/htmx.min.js" />
            {props.ws && <script src="/public/js/ws.js" />}
            {/* <script src="public/js/refresh.js" /> */}

            <title>{props.title ?? "BEPH-Starter"}</title>
            {props.head}
        </head>
        <body class="h-full w-full fixed overflow-y-auto" >
            <div class="flex flex-col items-center md:justify-center gap-4 min-h-[100%]">
                {props.children}
            </div>
        </body>
    </html>
</>;
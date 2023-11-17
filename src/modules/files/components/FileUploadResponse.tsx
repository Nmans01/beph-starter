import { For } from "../../common/components/primitives/For";
import { Component } from "../../common/components/types";

export const FileUploadResponse: Component<{}> = (props) => <>
    <div class="flex flex-col gap-2 border-2 rounded-md p-6 w-48 h-56 border-white bg-green-200/80 text-black">
        <span class="flex-1 text-center">success.</span>
        <button hx-get="/api/htmx/files" hx-trigger="click" class="btn btn-primary">
            view all
        </button>
        <a href="/files" class="btn btn-primary">
            upload again
        </a>
    </div>
</>;

export const Files: Component<{ files: string[] }> = (props) => {
    return <div>
        <For each={props.files} children={(file) =>
            <img src={`/public/img/${file}`} />
        } />
    </div>;
};
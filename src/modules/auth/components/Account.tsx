import { Component } from "../../common/components/types";

export const Account: Component<{ name?: string }> = ({ name }) => name !== undefined
    ? <div hx-trigger="click" hx-post="/api/htmx/auth/logout" hx-swap="outerHTML" class="p-2 rounded-full border-white hover:border-cyan-300/60 border-2 text-xs group cursor-pointer w-32 transition-all" >
        <span class=" group-hover:hidden">Logged in as {name}</span>
        <span class="hidden group-hover:inline transition-all text-cyan-100/60">Log out?</span>
    </div>
    : <a class="p-2 rounded-full border-cyan-300/30 border-2 text-xs w-32 block text-cyan-100/60" href="/login">
        Log in {name}
    </a>;
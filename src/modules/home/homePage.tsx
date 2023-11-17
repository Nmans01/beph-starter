import { Component } from "../common/components/types";
import { Count } from "../count/components/Count";
import { Page } from "../common/components/Page";
import { Chat, JoinChat } from "../chat/components/Chat";

export const HomePage: Component = () => <>
  <Page title="BEPH-Starter | Home Page" ws>
    <h2 class="text-xl">Fetch and Swap Demo:</h2>
    <div class="flex gap-2">
      <button class="btn btn-secondary"
        hx-get="/api/htmx/hello"
        hx-trigger="click"
        hx-target="#hello"
        hx-swap="outerHTML"
      >
        Click Me!
      </button>
      <div class="p-2 rounded-md border-2 border-white/40">
        <p id="hello" class="px-2">...</p>
      </div>
    </div>
  </Page>
</>;
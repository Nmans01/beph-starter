import { Fancy } from "./Fancy";
import { Component } from "./types";

const A = (props: JSX.IntrinsicElements['a']) =>
  <a href={props.href} class={"hover:brightness-200 transition-all " + props.class} > {props.children} </a>;

export const Header: Component<{}> = () => <>
  <header class="flex flex-col gap-4 p-8 text-center relative">
    <div class="absolute left-1/2 -translate-x-1/2 bottom-full" hx-trigger="load" hx-get="/api/htmx/auth/status" />
    <A href="/">
      <h1 class="text-2xl md:text-4xl">
        <Fancy>🥟 BEPH-Starter 🦊</Fancy>
      </h1>
    </A >
    <span class="-mb-4"><Fancy>Powered by</Fancy></span>
    <span class="text-xl">
      <Fancy>
        Bun + Elysia + Prisma + HTMX + Tailwind
      </Fancy>
    </span>
    <span class="-mb-4"><Fancy>Inspired by</Fancy></span>
    <span class="text-xl">
      <Fancy>
        <a href="https://github.com/atridadl/Darius">
          atridadl/Darius
          <span class="text-sm align-super">↗</span>
        </a>
      </Fancy>
    </span>
    <nav class="flex gap-4 justify-center flex-wrap max-w-md">
      <A href="/" class="p-2 pb-0">Fetch and Swap</A>
      <A href="/counter" class="p-2 pb-0">Websocket Counter</A>
      <A href="/chat" class="p-2 pb-0">Websocket Chat</A>
      <A href="/files" class="p-2 pb-0">File Upload</A>
    </nav>
  </header>
</>;

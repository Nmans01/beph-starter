import Elysia from "elysia";
import { Component } from "../common/components/types";

const CountComponent: Component<{ count: number }> = ({ count }) => <p id="countfromserver" class="ml-2">{count}</p>;

export const countService = new Elysia()
  .state({ count: 0 })

  .decorate({ CountComponent })

  .derive(({ store }) => ({
    incrementCount: () =>
      <CountComponent count={++store.count} />,

    decrementCount: () =>
      <CountComponent count={--store.count} />,

    getCount: () =>
      <CountComponent count={store.count} />
  }))
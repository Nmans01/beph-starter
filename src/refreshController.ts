import { Elysia } from "elysia";
import { ElysiaWS } from "elysia/dist/ws";

export const refreshController = new Elysia()
  .state({ conx: [] as ElysiaWS<any, any>[] })

  .derive(({ store }) => ({
    dispatchRefresh: () => store.conx.forEach(conx => conx.close())
  }))

  .get("/refresh-now", ({ dispatchRefresh }) => {
    console.log("hot refresh started");
    dispatchRefresh();
  })

  .ws("/refresh", {
    open: ws => {
      const count = ws.data.store.conx.push(ws as any);
      console.log("refresh: ws opened -", ws.id, "Total:", count,);
    },
    close: ws => {
      const { store } = ws.data;
      store.conx = store.conx.filter(conx => conx.id === ws.id);
      console.log("refresh: ws closed -", ws.id, "Total:", store.conx.length);
    }
  });

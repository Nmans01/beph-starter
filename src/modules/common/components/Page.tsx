import { Base } from "./Base";
import { ParentComponent } from "./types";
import { Header } from "./Header";

export const Page: ParentComponent<Parameters<typeof Base>[0]> = ({ children, ...baseProps }) => <>
  <Base {...baseProps}>
    <div class="flex md:flex-row flex-col w-full md:divide-x-2 divide-cyan-300/50 gap-2 h-screen md:h-fit">
      <Header />
      <main class="flex flex-col gap-4 items-center justify-center flex-1">{children}</main>
    </div>
  </Base>
</>;

export const LoginPage: ParentComponent<Parameters<typeof Base>[0]> = ({ children, ...baseProps }) => <>
  <Base {...baseProps}>
    <main class="flex flex-col gap-4 items-center justify-center flex-1">{children}</main>
  </Base>
</>;
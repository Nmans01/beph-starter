import { ParentComponent } from "./types";

export const Fancy: ParentComponent<{}> = (props) => <span class="bg-gradient-to-br from-cyan-300 to-purple-300 bg-clip-text text-transparent box-decoration-clone">{props.children}</span>;

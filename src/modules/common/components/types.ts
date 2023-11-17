export type Component<P = {}> = (props: P) => JSX.Element;
export type ParentComponent<P = {}> = (props: P & { children: JSX.Element | JSX.Element[] }) => JSX.Element;
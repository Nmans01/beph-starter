export const For = <T extends readonly any[], U extends JSX.Element>(props: {
    each: T | undefined | null | false;
    fallback?: JSX.Element;
    children: (item: T[number], index: number) => U;
}) => {
    let i = 0;
    return props.each
        ? <>{props.each.map(it => props.children(it, i++))}</>
        : props.fallback ?? null;
}
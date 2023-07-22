export function scrollIntoView(ref: React.RefObject<HTMLElement>): void {
    if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
    }
}
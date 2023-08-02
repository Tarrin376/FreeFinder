import { useState, useEffect, useCallback } from "react";

export function useKeyPress(targetKey: string, ref: React.RefObject<HTMLElement>): boolean {
    const [keyPressed, setKeyPressed] = useState<boolean>(false);

    const keyDownHandler = useCallback(({ key }: { key: string }): void => {
        if (key === targetKey) {
            setKeyPressed((cur) => !cur);
        }
    }, [targetKey]);

    useEffect(() => {
        const node = ref.current;
        node?.addEventListener("keydown", keyDownHandler);

        return () => {
            node?.removeEventListener("keydown", keyDownHandler);
        }
    }, [keyDownHandler, ref]);

    return keyPressed;
}
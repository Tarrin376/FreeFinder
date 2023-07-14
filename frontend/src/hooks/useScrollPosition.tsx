import { useEffect, useState, useCallback } from "react";
import { ScrollPosition } from "../types/ScrollPosition";

const initialState: ScrollPosition = {
    top: 0,
    left: 0,
}

export function useScrollPosition(ref: React.RefObject<HTMLDivElement>, refVisible: boolean): ScrollPosition {
    const [scrollPosition, setScrollPosition] = useState<ScrollPosition>(initialState);

    const updateScrollPosition = useCallback(() => {
        if (!ref.current) {
            return;
        }

        const top = ref.current.scrollTop;
        const left = ref.current.scrollLeft;
        setScrollPosition({ top: top, left: left });
    }, [ref]);

    useEffect(() => {
        const node = ref.current;
        node?.addEventListener("scroll", updateScrollPosition);
        updateScrollPosition();

        return () => {
            node?.removeEventListener("scroll", updateScrollPosition);
        }
    }, [ref, refVisible, updateScrollPosition]);

    return scrollPosition;
}
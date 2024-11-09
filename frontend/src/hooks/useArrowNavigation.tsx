import { useEffect, useState } from "react";
import { useKeyPress } from "./useKeyPress";

export function useArrowNavigation<T>
(
    componentRef: React.RefObject<HTMLDivElement>, 
    inputRef: React.RefObject<HTMLInputElement>, 
    data: T[], 
    heightOffset: number, 
    componentHeight: number
): number {
    const upArrow = useKeyPress("ArrowUp", inputRef);
    const downArrow = useKeyPress("ArrowDown", inputRef);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    useEffect(() => {
        setSelectedIndex((cur) => {
            if (componentRef.current && cur <= data.length - Math.floor((componentHeight / heightOffset))) {
                componentRef.current.scrollTop -= heightOffset;
            }

            return Math.max(0, cur - 1);
        });
    }, [upArrow, componentRef, data.length, componentHeight, heightOffset]);

    useEffect(() => {
        setSelectedIndex((cur) => {
            if (componentRef.current && cur >= Math.floor((componentHeight / heightOffset)) - 1) {
                componentRef.current.scrollTop += heightOffset;
            }

            return Math.min(data.length - 1, cur + 1);
        });
    }, [downArrow, componentRef, data.length, componentHeight, heightOffset]);

    return selectedIndex;
}
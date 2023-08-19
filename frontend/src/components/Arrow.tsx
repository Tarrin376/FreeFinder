import RightArrowIcon from "../assets/right-arrow.png";
import { useRef, useEffect, useCallback } from "react";

interface ArrowProps {
    action: () => void,
    direction: "up" | "down" | "left" | "right",
    size: number,
    alt: string
}

function Arrow({ action, direction, size, alt }: ArrowProps) {
    const rotate = useRef<number>(0);
    const defaultStyles = `flex items-center justify-center 
    hover:bg-hover-light-gray rounded-full cursor-pointer flex-shrink-0`;

    const calculateRotation = useCallback((): number => {
        switch (direction) {
            case "up":
                return 270
            case "left":
                return 180
            case "right":
                return 0
            default:
                return 90
        }
    }, [direction]);

    useEffect(() => {
        rotate.current = calculateRotation();
    }, [calculateRotation]);

    return (
        <div className={defaultStyles} onClick={action} style={{ width: `${size}px`, height: `${size}px` }} title={alt}>
            <img 
                src={RightArrowIcon} 
                alt={alt}
                style={{ 
                    width: `${Math.floor(0.5 * size)}px`, 
                    height: `${Math.floor(0.5 * size)}px`,  
                    rotate: `${rotate.current}deg` 
                }} 
            />
        </div>
    )
}

export default Arrow;
import { useState, useEffect } from 'react';

export function useWindowSize(): number {
    const [windowSize, setWindowSize] = useState<number>(0);

    function updateWindowSize(): void {
        setWindowSize(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', updateWindowSize);
        updateWindowSize();

        return () => {
            window.removeEventListener('resize', updateWindowSize);
        }
    }, []);

    return windowSize;
}
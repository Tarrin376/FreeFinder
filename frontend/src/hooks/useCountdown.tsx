import { useState, useEffect, useCallback } from "react";

export function useCountdown(endDate: Date) {
    const [timeRemaining, setTimeRemaining] = useState<string>("");

    const getTimeRemaining = useCallback((): string => {
        const ms = endDate.getTime() - Date.now();

        if (ms <= 0) {
            return `Expired`;
        }

        const days = (Math.floor(ms / 1000 / 60 / 60 / 24)).toString().padStart(2, '0');
        const hours = (Math.floor((ms / 1000 / 60 / 60)) % 24).toString().padStart(2, '0');
        const minutes = (Math.floor((ms / 1000 / 60) % 60)).toString().padStart(2, '0');
        const seconds = (Math.floor((ms / 1000) % 60)).toString().padStart(2, '0');
        return `${days} days ${hours} hrs ${minutes} mins ${seconds} seconds`;
    }, [endDate]);

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = getTimeRemaining();
            setTimeRemaining(remaining);
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [getTimeRemaining]);

    return timeRemaining;
}
import { useState, useEffect, useCallback } from "react";

export function useCountdown(endDate: Date) {
    const [timeRemaining, setTimeRemaining] = useState<string>("");

    const getTimeRemaining = useCallback((): string => {
        const ms = endDate.getTime() - Date.now();

        if (ms <= 0) {
            return `Expired`;
        }

        const days = Math.floor(ms / 1000 / 60 / 60 / 24);
        const hours = Math.floor((ms / 1000 / 60 / 60) % 24);
        const minutes = Math.floor((ms / 1000 / 60) % 60);
        const seconds = Math.floor((ms / 1000) % 60);
        return `${days} ${days === 1 ? "day" : "days"} ${hours} ${hours === 1 ? "hour" : "hours"} 
        ${minutes} ${minutes === 1 ? "min" : "mins"} ${seconds} ${seconds === 1 ? "second" : "seconds"}`;
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
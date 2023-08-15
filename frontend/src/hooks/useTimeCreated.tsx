import { useState, useEffect, useCallback } from "react";
import { getSeconds } from "src/utils/getSeconds";

export function useTimeCreated(date: Date | undefined) {
    const [timeCreated, setTimeCreated] = useState<string>("");

    function getTimeCreated(createdAt: Date): string {
        const seconds = getSeconds(createdAt);
        if (seconds < 60) {
            return `${seconds} ${seconds !== 1 ? 'seconds' : 'second'} ago`;
        } else if (seconds < 60 * 60) {
            const minutes = Math.floor(seconds / 60);
            return `${minutes} ${minutes !== 1 ? 'minutes' : 'minute'} ago`;
        } else if (seconds < 60 * 60 * 24) {
            const hours = Math.floor(seconds / 60 / 60);
            return `${hours} ${hours !== 1 ? 'hours' : 'hour'} ago`;
        } else {
            const days = Math.floor(seconds / 60 / 60 / 24);
            return `${days} ${days !== 1 ? 'days' : 'day'} ago`;
        }
    }

    const updateTimeCreated = useCallback((): void => {
        const created = date ? getTimeCreated(date) : "";
        setTimeCreated(created);
    }, [date]);
    
    useEffect(() => {
        const interval = setInterval(updateTimeCreated, 1000);
        updateTimeCreated();

        return () => {
            clearInterval(interval);
        }
    }, [updateTimeCreated]);

    return timeCreated;
}
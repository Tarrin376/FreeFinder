export function getTimeCreated(createdAt: Date, text?: string): string {
    const seconds = getSeconds(createdAt);
    if (seconds < 60) {
        return `${text ? `${text} ` : ""}${seconds} ${seconds !== 1 ? 'seconds' : 'second'} ago`;
    } else if (seconds < 60 * 60) {
        const minutes = Math.floor(seconds / 60);
        return `${text ? `${text} ` : ""}${minutes} ${minutes !== 1 ? 'minutes' : 'minute'} ago`;
    } else if (seconds < 60 * 60 * 24) {
        const hours = Math.floor(seconds / 60 / 60);
        return `${text ? `${text} ` : ""}${hours} ${hours !== 1 ? 'hours' : 'hour'} ago`;
    } else {
        const days = Math.floor(seconds / 60 / 60 / 24);
        return `${text ? `${text} ` : ""}${days} ${days !== 1 ? 'days' : 'day'} ago`;
    }
}

export function getSeconds(createdAt: Date): number {
    const createdAtDate: Date = new Date(createdAt);
    return Math.floor((new Date().getTime() - createdAtDate.getTime()) / 1000);
}
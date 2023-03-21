export function getTimePosted(createdAt: Date): string {
    const seconds = getSeconds(createdAt);
    if (seconds < 60) {
        return `Posted ${seconds} ${seconds !== 1 ? 'seconds' : 'second'} ago`;
    } else if (seconds < 60 * 60) {
        const minutes = Math.floor(seconds / 60);
        return `Posted ${minutes} ${minutes !== 1 ? 'minutes' : 'minute'} ago`;
    } else if (seconds < 60 * 60 * 24) {
        const hours = Math.floor(seconds / 60 / 60);
        return `Posted ${hours} ${hours !== 1 ? 'hours' : 'hour'} ago`;
    } else {
        const days = Math.floor(seconds / 60 / 60 / 24);
        return `Posted ${days} ${days !== 1 ? 'days' : 'day'} ago`;
    }
}

export function getSeconds(createdAt: Date): number {
    const createdAtDate: Date = new Date(createdAt);
    return Math.floor((new Date().getTime() - createdAtDate.getTime()) / 1000);
}
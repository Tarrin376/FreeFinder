export function getSeconds(createdAt: Date): number {
    const createdAtDate: Date = new Date(createdAt);
    return Math.floor((new Date().getTime() - createdAtDate.getTime()) / 1000);
}
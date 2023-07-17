
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function parseDate(date: Date): string {
    const newDate = new Date(date);
    return `${months[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
}
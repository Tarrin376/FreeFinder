
export function getTime(date: Date): string {
    const newDate = new Date(date);
    const hour = newDate.getHours();
    const minutes = newDate.getMinutes().toString().padStart(2, '0');
    const timeOfDay = hour % 12 === hour ? "AM" : "PM";
    return `${timeOfDay === "PM" && hour !== 12 ? hour % 12 : hour}:${minutes} ${timeOfDay}`;
}
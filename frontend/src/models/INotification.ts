export interface INotification {
    notificationID: string,
    title: string,
    text: string,
    createdAt: Date,
    unread: boolean,
    navigateTo: string | null,
    xp: number
}
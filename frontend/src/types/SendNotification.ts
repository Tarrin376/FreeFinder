import { INotification } from "src/models/INotification"

export type SendNotification = {
    socketID: string,
    notification: INotification
}
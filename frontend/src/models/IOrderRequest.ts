import { OrderRequestStatus } from "../enums/OrderRequestStatus";

export interface IOrderRequest {
    status: OrderRequestStatus,
    id: string,
    actionTaken: Date,
    expires: Date,
    subTotal: number,
    total: number,
    package: {
        revisions: string,
        deliveryTime: number,
        type: string
    }
}
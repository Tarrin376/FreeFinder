import { OrderRequestStatus } from "src/enums/OrderRequestStatus";

export interface ICompleteOrderRequest {
    status: OrderRequestStatus,
    expires: Date,
    id: string,
    order: {
        subTotal: number,
        total: number,
        sellerID: string,
        clientID: string
        orderID: string
    }
}
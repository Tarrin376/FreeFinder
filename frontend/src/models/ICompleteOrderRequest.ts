import { CompleteOrderRequestStatus } from "src/enums/CompleteOrderRequestStatus"

export interface ICompleteOrderRequest {
    status: CompleteOrderRequestStatus,
    expires: Date,
    id: string,
    order: {
        select: {
            subTotal: number,
            total: number
        }
    }
}
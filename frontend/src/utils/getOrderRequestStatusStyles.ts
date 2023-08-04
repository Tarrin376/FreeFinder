import { OrderRequestStatus } from "../enums/OrderRequestStatus";

export function getOrderRequestStatusStyles(status: OrderRequestStatus): React.CSSProperties {
    switch (status) {
        case OrderRequestStatus.PENDING:
            return { color: "#ed8912" };
        case OrderRequestStatus.ACCEPTED:
            return { color: "#30ab4b" };
        default:
            return { color: "#F43C3C" };
    }
}
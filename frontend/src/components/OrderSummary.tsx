import SummaryItem from "./SummaryItem";

interface OrderSummaryProps {
    subTotal: number,
    total: number,
    deliveryTime: number,
    styles?: string
}

export const SERVICE_FEE = 0.05;

function OrderSummary({ subTotal, total, deliveryTime, styles }: OrderSummaryProps) {
    return (
        <div className={styles}>
            <SummaryItem
                label="Subtotal"
                value={`£${subTotal.toFixed(2)}`}
                styles="mb-2"
            />
            <SummaryItem
                label={`Service fee (${SERVICE_FEE * 100}%)`}
                value={`£${(subTotal * SERVICE_FEE).toFixed(2)}`}
                styles="pb-4 border-b border-light-border-gray"
            />
            <SummaryItem
                label="Total"
                value={`£${total.toFixed(2)}`}
                styles="pt-4 font-bold mb-2"
            />
            <SummaryItem
                label="Delivery time"
                value={`${deliveryTime} ${deliveryTime === 1 ? "day" : "days"}`}
            />
        </div>
    )
}

export default OrderSummary;
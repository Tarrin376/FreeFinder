import SummaryItem from "./SummaryItem";

interface OrderSummaryProps {
    subtotal: number,
    deliveryTime: number,
    styles?: string
}

const serviceFeePercentage = 0.05;

function OrderSummary({ subtotal, deliveryTime, styles }: OrderSummaryProps) {
    return (
        <div className={styles}>
            <SummaryItem
                label="Subtotal"
                value={`£${subtotal.toFixed(2)}`}
                styles="mb-2"
            />
            <SummaryItem
                label={`Service fee (${serviceFeePercentage * 100}%)`}
                value={`£${(subtotal * serviceFeePercentage).toFixed(2)}`}
                styles="pb-4 border-b border-light-border-gray"
            />
            <SummaryItem
                label="Total"
                value={`£${(subtotal + (subtotal * serviceFeePercentage)).toFixed(2)}`}
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
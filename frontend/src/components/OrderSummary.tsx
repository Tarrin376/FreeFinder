import SummaryItem from "./SummaryItem";

interface OrderSummaryProps {
    subtotal: number,
    deliveryTime: number
}

const serviceFeePercentage = 0.05;

function OrderSummary({ subtotal, deliveryTime }: OrderSummaryProps) {
    return (
        <div>
            <h2 className="mt-5 mb-3">Summary</h2>
            <SummaryItem
                label="Subtotal"
                value={`£${subtotal.toFixed(2)}`}
                styles="mb-2"
            />
            <SummaryItem
                label={`Service fee (${serviceFeePercentage * 100}%)`}
                value={`£${(subtotal * serviceFeePercentage).toFixed(2)}`}
                styles="pb-5 border-b border-light-border-gray"
            />
            <SummaryItem
                label="Total"
                value={`£${(subtotal + (subtotal * serviceFeePercentage)).toFixed(2)}`}
                styles="pt-5 font-bold mb-2"
            />
            <SummaryItem
                label="Delivery time"
                value={`${deliveryTime} ${deliveryTime === 1 ? "day" : "days"}`}
                styles="mb-2"
            />
        </div>
    )
}

export default OrderSummary;
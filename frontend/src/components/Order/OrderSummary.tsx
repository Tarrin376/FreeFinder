import SummaryItem from "./SummaryItem";
import { SERVICE_FEE } from "@freefinder/shared/dist/constants";

interface OrderSummaryProps {
    subTotal: number,
    total: number,
    deliveryTime?: number,
    onlyShowTotal?: boolean,
    styles?: string
}

function OrderSummary({ subTotal, total, deliveryTime, onlyShowTotal, styles }: OrderSummaryProps) {
    return (
        <div className={styles}>
            {!onlyShowTotal && 
            <>
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
            </>}
            <SummaryItem
                label="Total"
                value={`£${total.toFixed(2)}`}
                styles="pt-4 font-bold"
            />
            {deliveryTime !== undefined &&
            <SummaryItem
                label="Delivery time"
                value={`${deliveryTime} ${deliveryTime === 1 ? "day" : "days"}`}
                styles="mt-2"
            />}
        </div>
    )
}

export default OrderSummary;
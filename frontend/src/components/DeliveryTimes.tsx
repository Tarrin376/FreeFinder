import { deliveryTimes } from "../utils/deliveryTimes";

interface DeliveryTimesProps {
    loading: boolean,
    searchHandler: () => void,
    deliveryTime: React.MutableRefObject<number>,
}

function DeliveryTimes({ loading, searchHandler, deliveryTime }: DeliveryTimesProps) {
    function updateDeliveryTime(newDeliveryTime: number): void {
        deliveryTime.current = newDeliveryTime;
        searchHandler();
    }

    return (
        <div className="border-b border-light-border-gray pb-5">
            <h3 className="text-side-text-gray mb-2 text-[16px]">Delivery time</h3>
            <div className="flex flex-col gap-2">
                {Object.keys(deliveryTimes).map((cur: string, index: number) => {
                    return (
                        <div className="flex items-center gap-3" key={index}>
                            <input 
                                type="radio" 
                                name="delivery-time" 
                                className={`w-[15px] h-[15px] mt-[1px] ${loading ? "invalid-button" : ""}`}
                                id={cur}
                                defaultChecked={deliveryTimes[cur] === deliveryTime.current}
                                onChange={() => updateDeliveryTime(deliveryTimes[cur])}
                            />
                            <label htmlFor={cur} className="text-[15px]">
                                {cur}
                            </label>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default DeliveryTimes;
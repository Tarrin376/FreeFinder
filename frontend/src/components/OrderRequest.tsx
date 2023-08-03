import { IMessage } from "../models/IMessage";
import { IPackage } from "../models/IPackage";
import { FoundUsers } from "../types/FoundUsers";
import PackageOverview from "./PackageOverview";

interface OrderRequestProps {
    message: IMessage,
    isOwnMessage: boolean,
    seller: FoundUsers[number],
    workType: string
}

function OrderRequest({ message, isOwnMessage, seller, workType }: OrderRequestProps) {
    return (
        <div>
            <p className="text-main-white">
                {`${isOwnMessage ? "You" : message.from.username} requested an order for this service.`}
            </p>
            <PackageOverview 
                curPkg={message.orderRequest?.package as IPackage}
                seller={seller}
                workType={workType}
                styles="my-2"
            />
        </div>
    )
}

export default OrderRequest;
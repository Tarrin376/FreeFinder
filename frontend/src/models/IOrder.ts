import { OrderStatus } from "src/enums/OrderStatus";
import { PackageTypes } from "src/enums/PackageTypes";
import { UserStatus } from "src/enums/UserStatus";

export interface IOrder {
    status: OrderStatus,
    total: number,
    deliveryEndDate: Date,
    createdAt: Date,
    orderID: string,
    isClientOrder: boolean,
    package: {
        type: PackageTypes,
        revisions: string,
        post: {
            title: string,
            postID: string,
            workType: {
                name: string
            }
        }
    },
    user: {
        username: string,
        status: UserStatus,
        profilePicURL: string,
        email: string,
        country: string
    }
}
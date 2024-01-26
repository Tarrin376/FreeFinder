import PageWrapper from "src/wrappers/PageWrapper";
import { useState, useRef, useContext } from "react";
import { usePaginateData } from "src/hooks/usePaginateData";
import { IOrder } from "src/models/IOrder";
import { PaginationResponse } from "src/types/PaginateResponse";
import { UserContext } from "src/providers/UserProvider";
import Order from "src/components/Order/Order";
import PaginationScrollInfo from "src/components/PaginationScrollInfo";
import NoResultsFound from "src/components/NoResultsFound";

function ClientOrdersView() {
    const userContext = useContext(UserContext);

    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();

    const url = `/api/sellers/${userContext.userData.seller?.sellerID}/orders`;
    const clientOrders = usePaginateData<{}, IOrder, PaginationResponse<IOrder>>(pageRef, cursor, url, page, setPage, {});

    return (
        <PageWrapper styles="pt-14">
            <h1 className="text-[30px] mb-3">
                Client orders
            </h1>
            <p className="text-[15px] text-side-text-gray border-b border-light-border-gray pb-7 mb-7">
                Here, you can review and manage all orders with their details. You can view and edit the delivery status of 
                an order, get in touch with clients about potential delays, notify the client of the project's completion, and much more!
            </p>
            <div ref={pageRef} className="flex flex-col gap-6 overflow-y-scroll">
                {clientOrders.data.map((order: IOrder) => {
                    return (
                        <Order
                            order={order}
                            isClientOrder={true}
                            key={order.orderID} 
                        />
                    )
                })}
            </div>
            <PaginationScrollInfo 
                data={clientOrders} 
                page={page.value}
                styles="mt-7 mb-7"
            />
            {!clientOrders.loading && clientOrders.data.length === 0 &&
            <NoResultsFound 
                title={"Looks like you have no orders..."}
                message="If you are searching for an order, please check your filters and try again."
            />}
        </PageWrapper>
    )
}

export default ClientOrdersView;
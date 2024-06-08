import PageWrapper from "src/wrappers/PageWrapper";
import { useState, useRef, useContext } from "react";
import { usePaginateData } from "src/hooks/usePaginateData";
import { IOrder } from "src/models/IOrder";
import { PaginationResponse } from "src/types/PaginateResponse";
import { UserContext } from "src/providers/UserProvider";
import Order from "src/components/Order/Order";
import PaginationScrollInfo from "src/components/PaginationScrollInfo";
import NoResultsFound from "src/components/NoResultsFound";

function MyOrdersView() {
    const userContext = useContext(UserContext);
    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();

    const url = `/api/users/${userContext.userData.username}/orders`;
    const orders = usePaginateData<{}, IOrder, PaginationResponse<IOrder>>(pageRef, cursor, url, page, setPage, {});

    return (
        <PageWrapper styles="pt-14">
            <h1 className="text-[30px] mb-3">
                My orders
            </h1>
            <p className="text-[15px] text-side-text-gray border-b border-light-border-gray pb-7 mb-7">
                Manage your recent orders and view shared files
            </p>
            <div ref={pageRef} className="flex flex-col gap-5 overflow-y-scroll">
                {orders.data.map((order: IOrder) => {
                    return (
                        <Order
                            order={order}
                            isClientOrder={false}
                            key={order.orderID} 
                        />
                    )
                })}
            </div>
            <PaginationScrollInfo 
                data={orders} 
                page={page.value}
                styles="mt-7 mb-7"
            />
            {!orders.loading && orders.data.length === 0 &&
            <NoResultsFound
                title={"Sorry, we could not find any orders."}
                message="If you are searching for an order, please check your filters and try again."
            />}
        </PageWrapper>
    )
}

export default MyOrdersView;
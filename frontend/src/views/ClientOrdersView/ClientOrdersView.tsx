import PageWrapper from "src/wrappers/PageWrapper";
import { ClientOrdersSections } from "src/enums/ClientOrdersSections";
import { useReducer } from "react";

type ClientOrdersViewState = {
    option: ClientOrdersSections
}

const INITIAL_STATE: ClientOrdersViewState = {
    option: ClientOrdersSections.allOrders
}

function ClientOrdersView() {
    const [state, dispatch] = useReducer((state: ClientOrdersViewState, cur: Partial<ClientOrdersViewState>) => {
        return { ...state, ...cur }
    }, INITIAL_STATE);

    function updateSection(option: ClientOrdersSections): void {
        dispatch({ option: option });
    }

    return (
        <PageWrapper styles="pt-14">
            <h1 className="text-[30px] mb-1">
                Client orders
            </h1>
            <p className="text-[15px] text-side-text-gray border-b border-light-border-gray pb-7">
                Manage your recent orders and view shared files
            </p>
            
        </PageWrapper>
    )
}

export default ClientOrdersView;
import PopUpWrapper from "src/wrappers/PopUpWrapper";
import { FilterPostsProviderState } from "src/providers/FilterPostsProvider";
import Filters from "./Filters";

interface FiltersPopUpProps {
    loading: boolean,
    deliveryTime: React.MutableRefObject<number>,
    searchHandler: () => void,
    dispatch: React.Dispatch<Partial<FilterPostsProviderState>>,
    toggleFiltersPopUp: () => void,
    state: FilterPostsProviderState
}

function FiltersPopUp({ loading, deliveryTime, searchHandler, dispatch, toggleFiltersPopUp, state }: FiltersPopUpProps) {
    function applyFilters(): void {
        searchHandler();
        toggleFiltersPopUp();
    }

    return (
        <PopUpWrapper title="Filters" setIsOpen={toggleFiltersPopUp} styles="h-[650px]">
            <Filters 
                loading={loading}
                deliveryTime={deliveryTime}
                searchHandler={searchHandler}
                dispatch={dispatch}
                state={state}
            />
            <button className="main-btn mt-5" onClick={applyFilters}>
                Apply filters
            </button>
        </PopUpWrapper>
    )
}

export default FiltersPopUp;
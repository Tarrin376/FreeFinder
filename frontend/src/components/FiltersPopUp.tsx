import PopUpWrapper from "src/wrappers/PopUpWrapper";
import { FilterPostsProviderState } from "src/providers/FilterPostsProvider";
import Filters from "./Filters";

interface FiltersPopUpProps {
    loading: boolean,
    searchHandler: () => void,
    dispatch: React.Dispatch<Partial<FilterPostsProviderState>>,
    toggleFiltersPopUp: () => void,
    state: FilterPostsProviderState,
    clearFilters: () => void
}

function FiltersPopUp({ loading, searchHandler, dispatch, toggleFiltersPopUp, state, clearFilters }: FiltersPopUpProps) {
    function applyFilters(): void {
        searchHandler();
        toggleFiltersPopUp();
    }

    return (
        <PopUpWrapper title="Filters" setIsOpen={toggleFiltersPopUp} styles="h-[650px]">
            <Filters 
                loading={loading}
                dispatch={dispatch}
                state={state}
            />
            <div className="flex items-center justify-between mt-5">
                <span className="underline font-bold text-main-blue cursor-pointer" 
                onClick={clearFilters}>
                    Clear all
                </span>
                <button className="main-btn w-fit" onClick={applyFilters}>
                    Apply filters
                </button>
            </div>
        </PopUpWrapper>
    )
}

export default FiltersPopUp;
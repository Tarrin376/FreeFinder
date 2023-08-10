import PopUpWrapper from "src/wrappers/PopUpWrapper";
import { FilterPostsProviderState } from "src/providers/FilterPostsProvider";
import Filters from "./Filters";

interface FiltersPopUpProps {
    loading: boolean,
    searchHandler: () => void,
    dispatch: React.Dispatch<Partial<FilterPostsProviderState>>,
    toggleFiltersPopUp: () => void,
    state: FilterPostsProviderState,
    clearFilters: () => void,
    modifiedFiltersCount: number,
    setModifiedFiltersCount: React.Dispatch<React.SetStateAction<number>>,
    getModifiedFiltersCount: () => number
}

function FiltersPopUp(props: FiltersPopUpProps) {
    function applyFilters(): void {
        props.setModifiedFiltersCount(props.getModifiedFiltersCount());
        props.searchHandler();
        props.toggleFiltersPopUp();
    }

    return (
        <PopUpWrapper title="Filters" setIsOpen={props.toggleFiltersPopUp} styles="h-[650px]">
            <Filters 
                loading={props.loading}
                dispatch={props.dispatch}
                state={props.state}
            />
            <div className="flex items-center justify-between">
                <span className="underline font-bold text-main-blue cursor-pointer" 
                onClick={props.clearFilters}>
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
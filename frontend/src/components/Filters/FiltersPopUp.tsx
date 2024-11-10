import PopUpWrapper from "src/wrappers/PopUpWrapper";
import { FilterPostsProviderState } from "src/providers/FilterPostsProvider";
import AllFilters from "./AllFilters";
import { useState } from "react";
import MessageSent from "../Message/MessageSent";

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
    const [cleared, setCleared] = useState<boolean>(false);

    function applyFilters(): void {
        props.setModifiedFiltersCount(props.getModifiedFiltersCount());
        props.searchHandler();
        props.toggleFiltersPopUp();
    }

    function clear(): void {
        props.clearFilters();
        setCleared(true);
        setTimeout(() => setCleared(false), 3000);
    }

    return (
        <PopUpWrapper title="Filters" setIsOpen={props.toggleFiltersPopUp} styles="h-[650px]">
            <AllFilters 
                loading={props.loading}
                dispatch={props.dispatch}
                state={props.state}
            />
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <span className="text-main-blue cursor-pointer" onClick={clear}>
                        Clear all
                    </span>
                    {cleared &&
                    <MessageSent
                        sendingMessage={false}
                        colour="#4169f7"
                    />}
                </div>
                <button className="main-btn w-fit" onClick={applyFilters}>
                    Apply filters
                </button>
            </div>
        </PopUpWrapper>
    )
}

export default FiltersPopUp;
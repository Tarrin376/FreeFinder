import SearchIcon from "../assets/search.png";
import Price from "./Price";
import { MAX_SERVICE_PRICE } from "@freefinder/shared/dist/constants";
import SortBy from "./SortBy";
import NavDropdown from "./NavDropdown";
import { FilterPostsProviderState } from "src/providers/FilterPostsProvider";
import { useWindowSize } from "src/hooks/useWindowSize";
import FilterIcon from "../assets/filter.png";

interface MainFiltersBarProps {
    dispatch: React.Dispatch<Partial<FilterPostsProviderState>>,
    state: FilterPostsProviderState,
    loading: boolean,
    searchHandler: () => void,
    toggleFiltersPopUp: () => void,
    modifiedFiltersCount: number
}

function MainFiltersBar({ dispatch, state, loading, searchHandler, toggleFiltersPopUp, modifiedFiltersCount }: MainFiltersBarProps) {
    const windowSize = useWindowSize();

    return (
        <div className="h-[90px] max-w-[1430px] m-auto flex items-center px-7">
            <div className="flex flex-grow items-center gap-6 border-r border-light-border-gray h-full pr-6">
                <div className="flex items-center flex-grow">
                    <img src={SearchIcon} alt="" className="w-5 h-5" />
                    <input
                        type="text" 
                        placeholder="Search by work type or service ID" 
                        className="flex-grow focus:outline-none placeholder-side-text-gray ml-3" 
                        onChange={(e) => dispatch({ search: e.target.value })}
                        value={state.search}
                    />
                </div>
                <NavDropdown 
                    title={state.searchOption}
                    items={[
                        ["Work type", () => dispatch({ searchOption: "Work type" })],
                        ["Service ID", () => dispatch({ searchOption: "Service ID" })],
                    ]} 
                />
            </div>
            <div className="h-full border-r border-light-border-gray px-[12.75px] flex items-center gap-3 max-[1560px]:hidden">
                <div className="w-[170px]">
                    <Price 
                        value={state.min} 
                        maxValue={MAX_SERVICE_PRICE}
                        text="min price" 
                        updateValue={(cur) => dispatch({ min: cur })}
                    />
                </div>
                <div>-</div>
                <div className="w-[170px]">
                    <Price 
                        value={state.max} 
                        maxValue={MAX_SERVICE_PRICE}
                        text="max price" 
                        updateValue={(cur) => dispatch({ max: cur })}
                    />
                </div>
            </div>
            <div className="h-full border-r border-light-border-gray pl-[12.75px] pr-[10px] flex items-center">
                <SortBy 
                    sort={state.sort} 
                    updateSort={(nextSort) => dispatch({ sort: nextSort })}
                />
            </div>
            {windowSize < 1180 &&
            <div className="h-full border-r border-light-border-gray px-[12.75px] flex items-center">
                <div className="relative">
                    <button className="side-btn !h-[48px] w-[110px] flex items-center justify-center gap-[5px]" onClick={toggleFiltersPopUp}>
                        <img src={FilterIcon} className="w-[15px] h-[15px]" alt="" />
                        <span className="text-main-blue">
                            Filters
                        </span>
                    </button>
                    {modifiedFiltersCount > 0 &&
                    <div className="bg-main-blue rounded-full w-fit px-[7px] h-[20px] flex items-center 
                    justify-center absolute top-[-6px] right-[-6px]">
                        <span className="text-xs text-main-white">
                            {modifiedFiltersCount}
                        </span>
                    </div>}
                </div>
            </div>}
            <div className="pl-[22.5px]">
                <button className={`btn-primary text-main-white bg-main-blue w-[160px] h-[48px] hover:bg-main-blue-hover
                ${loading ? "invalid-button" : ""}`}
                onClick={searchHandler}>
                    Search
                </button>
            </div>
        </div>
    )
}

export default MainFiltersBar;
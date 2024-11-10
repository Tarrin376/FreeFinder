import SearchIcon from "../../assets/search.png";
import Price from "../common/Price";
import { MAX_SERVICE_PRICE } from "@freefinder/shared/dist/constants";
import SortBy from "../common/SortBy";
import NavDropdown from "../Dropdown/NavDropdown";
import { FilterPostsProviderState } from "src/providers/FilterPostsProvider";
import { useWindowSize } from "src/hooks/useWindowSize";
import DropdownElement from "../Dropdown/DropdownElement";
import FiltersButton from "./FiltersButton";

interface MainFiltersBarProps {
    dispatch: React.Dispatch<Partial<FilterPostsProviderState>>,
    state: FilterPostsProviderState,
    loading: boolean,
    searchHandler: () => void,
    toggleFiltersPopUp: () => void,
    modifiedFiltersCount: number,
    pageRef: React.RefObject<HTMLDivElement>,
    children: React.ReactNode
}

function MainFiltersBar({ dispatch, state, loading, searchHandler, toggleFiltersPopUp, modifiedFiltersCount, pageRef, children }: MainFiltersBarProps) {
    const windowSize = useWindowSize();

    return (
        <div className="flex-grow">
            <div className="w-full border-b border-b-light-border-gray bg-white">
                <div className={`h-[90px] max-w-[1430px] m-auto flex items-center  ${windowSize >= 615 ? "px-7" : "pl-7"} 
                ${windowSize < 560 ? windowSize < 400 ? "!px-3" : "!px-5" : ""}`}>
                    <div className={`flex flex-grow items-center gap-6 ${windowSize >= 560 ? "border-r border-light-border-gray pr-6" : ""} h-full`}>
                        <div className="flex items-center flex-grow">
                            <img src={SearchIcon} alt="" className="w-5 h-5" />
                            <input
                                type="text" 
                                placeholder="Search for services" 
                                className="flex-grow focus:outline-none placeholder-side-text-gray ml-3" 
                                onChange={(e) => dispatch({ search: e.target.value })}
                                value={state.search}
                            />
                        </div>
                        <NavDropdown title={windowSize >= 430 ? state.searchOption : ""} textSize={16}>
                            <DropdownElement
                                text="Work type"
                                action={() => dispatch({ searchOption: "Work type" })}
                            />
                            <DropdownElement
                                text="Service ID"
                                action={() => dispatch({ searchOption: "Service ID" })}
                            />
                        </NavDropdown>
                    </div>
                    {windowSize >= 1650 &&
                    <div className="h-full border-r border-light-border-gray px-[12.75px] flex items-center gap-3">
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
                    </div>}
                    {windowSize >= 1015 &&
                    <div className="h-full border-r border-light-border-gray pl-[12.75px] pr-[10px]">
                        <SortBy 
                            sort={state.sort} 
                            updateSort={(nextSort) => dispatch({ sort: nextSort })}
                            text="Sort by:"
                        />
                    </div>}
                    {windowSize < 1245 && windowSize >= 1015 &&
                    <div className="h-full border-r border-light-border-gray px-[12.75px] flex items-center">
                        <FiltersButton
                            toggleFiltersPopUp={toggleFiltersPopUp}
                            modifiedFiltersCount={modifiedFiltersCount}
                        />
                    </div>}
                    {windowSize >= 615 &&
                    <div className="pl-[22.5px]">
                        <button className={`btn-primary text-main-white bg-main-blue w-[140px] h-[48px] hover:bg-main-blue-hover
                        ${loading ? "invalid-button" : ""}`}
                        onClick={searchHandler}>
                            Search
                        </button>
                    </div>}
                </div>
            </div>
            <div className="h-[calc(100vh-180px)] overflow-y-scroll" ref={pageRef}>
                {windowSize < 1015 &&
                <div className={`w-full h-fit pt-7 flex justify-between items-center 
                ${windowSize < 560 ? windowSize < 400 ? "px-3" : "px-5" : "px-7"} pb-0`}>
                    <SortBy 
                        sort={state.sort} 
                        updateSort={(nextSort) => dispatch({ sort: nextSort })}
                        text={windowSize >= 340 ? "Sort by:" : ""}
                    />
                    <FiltersButton
                        toggleFiltersPopUp={toggleFiltersPopUp}
                        modifiedFiltersCount={modifiedFiltersCount}
                    />
                </div>}
                {children}
            </div>
        </div>
    )
}

export default MainFiltersBar;
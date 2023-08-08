import SearchIcon from "../assets/search.png";
import Price from "./Price";
import { MAX_SERVICE_PRICE } from "@freefinder/shared/dist/constants";
import SortBy from "./SortBy";
import NavDropdown from "./NavDropdown";
import { FilterPostsProviderState } from "src/providers/FilterPostsProvider";

interface MainFiltersBarProps {
    dispatch: React.Dispatch<Partial<FilterPostsProviderState>>,
    state: FilterPostsProviderState,
    loading: boolean,
    searchHandler: () => void
}

function MainFiltersBar(props: MainFiltersBarProps) {
    return (
        <div className="h-[90px] max-w-[1430px] m-auto flex items-center px-[22.5px]">
            <div className="flex flex-grow items-center gap-6 border-r border-light-border-gray h-full pr-6">
                <div className="flex items-center flex-grow">
                    <img src={SearchIcon} alt="" className="w-5 h-5" />
                    <input
                        type="text" 
                        placeholder="Search by work type or service ID" 
                        className="flex-grow focus:outline-none placeholder-side-text-gray ml-3" 
                        onChange={(e) => props.dispatch({ search: e.target.value })}
                        value={props.state.search}
                    />
                </div>
                <NavDropdown 
                    title={props.state.searchOption}
                    items={[
                        ["Work type", () => props.dispatch({ searchOption: "Work type" })],
                        ["Service ID", () => props.dispatch({ searchOption: "Service ID" })],
                    ]} 
                />
            </div>
            <div className="h-full border-r border-light-border-gray px-[12.75px] flex items-center gap-3 max-[1682px]:hidden">
                <Price 
                    value={props.state.min} 
                    maxValue={MAX_SERVICE_PRICE}
                    title="min price" 
                    updateValue={(cur) => props.dispatch({ min: cur })}
                />
                <div>-</div>
                <Price 
                    value={props.state.max} 
                    maxValue={MAX_SERVICE_PRICE}
                    title="max price" 
                    updateValue={(cur) => props.dispatch({ max: cur })}
                />
            </div>
            <div className="h-full border-r border-light-border-gray pl-[12.75px] pr-[10px] flex items-center">
                <SortBy 
                    sort={props.state.sort} 
                    updateSort={(nextSort) => props.dispatch({ sort: nextSort })}
                />
            </div>
            <div className="pl-[22.5px]">
                <button className={`btn-primary text-main-white bg-main-blue w-[160px] h-[48px] hover:bg-main-blue-hover
                ${props.loading ? "invalid-button" : ""}`}
                onClick={props.searchHandler}>
                    Search
                </button>
            </div>
        </div>
    )
}

export default MainFiltersBar;
import SearchIcon from "../assets/search.png";
import Price from "./Price";
import { MAX_PRICE } from "../views/CreatePost/Package";
import SortBy from "./SortBy";
import CountriesDropdown from "./CountriesDropdown";

interface MainFiltersBarProps {
    searchRef: React.RefObject<HTMLInputElement>,
    min: number,
    max: number,
    setMin: React.Dispatch<React.SetStateAction<number>>,
    setMax: React.Dispatch<React.SetStateAction<number>>,
    country: string,
    setCountry: React.Dispatch<React.SetStateAction<string>>,
    sort: React.MutableRefObject<string>,
    loading: boolean,
    searchHandler: () => void
}

function MainFiltersBar(props: MainFiltersBarProps) {
    return (
        <div className="h-[90px] max-w-[1430px] m-auto flex items-center px-[22.5px]">
            <div className="flex flex-grow items-center border-r border-light-border-gray h-full pr-6">
                <img src={SearchIcon} alt="" className="w-5 h-5" />
                <input
                    type="text" 
                    placeholder="Search for post" 
                    className="flex-grow focus:outline-none placeholder-side-text-gray ml-3" 
                    ref={props.searchRef}
                />
            </div>
            <div className="h-full border-r border-light-border-gray px-[12.75px] flex items-center gap-3 max-[1682px]:hidden">
                <Price 
                    value={props.min} 
                    maxValue={MAX_PRICE}
                    title="min price" 
                    setValue={props.setMin}
                />
                <div>-</div>
                <Price 
                    value={props.max} 
                    maxValue={MAX_PRICE}
                    title="max price" 
                    setValue={props.setMax}
                />
            </div>
            <div className="h-full border-r border-light-border-gray px-[12.75px] flex items-center max-[1308px]:hidden">
                <CountriesDropdown 
                    country={props.country}
                    setCountry={props.setCountry}
                    styles="w-[240px]"
                    title="Seller lives in"
                    anyLocation={true}
                />
            </div>
            <div className="h-full border-r border-light-border-gray pl-[12.75px] pr-[10px] flex items-center">
                <SortBy sortBy={props.sort} />
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
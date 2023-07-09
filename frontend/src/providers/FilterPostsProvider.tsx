import SearchIcon from '../assets/search.png';
import Price from '../components/Price';
import { useRef, createContext, useState, useContext } from 'react';
import { MAX_PRICE, MAX_DELIVERY_DAYS } from '../views/CreatePost/Package';
import { usePaginatePosts } from '../hooks/usePaginatePosts';
import { IPost } from '../models/IPost';
import { sortPosts } from '../utils/sortPosts';
import { useLocation } from 'react-router-dom';
import SortBy from '../components/SortBy';
import CountriesDropdown from '../components/CountriesDropdown';
import CreatePost from '../views/CreatePost/CreatePost';
import AddIcon from '../assets/add.png';
import SearchLanguages from '../components/SearchLanguages';
import { deliveryTimes } from '../utils/deliveryTimes';
import { sellerLevels } from '../utils/sellerLevels';
import { extraFilters } from '../utils/extraFilters';
import { UserContext } from './UserContext';
import { sellerLevelTextStyles } from '../utils/sellerLevelTextStyles';
import SellerExperience from '../components/SellerExperience';
import { FilterPosts } from '../types/FilterPosts';

interface FilterPostsContextProps {
    children?: React.ReactNode,
    urlPrefix: string
}

interface SellerLevelsProps {
    setAllSellerLevels: React.Dispatch<React.SetStateAction<string[]>>,
    disabled: boolean,
    searchHandler: () => void
}

interface DeliveryTimesProps {
    loading: boolean,
    searchHandler: () => void,
    deliveryTime: React.MutableRefObject<number>,
}

interface MainFiltersBarProps {
    searchRef: React.RefObject<HTMLInputElement>,
    min: React.MutableRefObject<number>,
    max: React.MutableRefObject<number>,
    countryRef: React.RefObject<HTMLSelectElement>,
    sort: React.MutableRefObject<string>,
    loading: boolean,
    searchHandler: () => void
}

export const FilterPostsContext = createContext<FilterPosts | undefined>(undefined);

function FilterPostsProvider({ children, urlPrefix }: FilterPostsContextProps) {
    const cursor = useRef<string>("");
    const min = useRef<number>(0);
    const max = useRef<number>(MAX_PRICE);
    const sort = useRef<string>("most recent");
    const deliveryTime = useRef<number>(MAX_DELIVERY_DAYS);
    const searchRef = useRef<HTMLInputElement>(null);
    const countryRef = useRef<HTMLSelectElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const [postService, setPostService] = useState<boolean>(false);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [allSellerLevels, setAllSellerLevels] = useState<string[]>([]);
    const userContext = useContext(UserContext);

    const location = useLocation();

    const posts = usePaginatePosts<IPost>(
        pageRef, 
        cursor,
        `/api${urlPrefix}${location.pathname}`,
        page,
        setPage,
        {
            search: searchRef.current?.value,
            sort: sortPosts[sort.current],
            min: min.current,
            max: max.current,
            location: countryRef.current?.value === "Any country" ? undefined : countryRef.current?.value,
            languages: selectedLanguages,
            deliveryTime: deliveryTime.current,
            sellerLevels: allSellerLevels
        }
    );

    const nextLevelXP = userContext.userData.seller ? userContext.userData.seller.sellerLevel.nextLevel ? 
    userContext.userData.seller.sellerLevel.nextLevel.xpRequired : userContext.userData.seller.sellerXP : 0;

    const nextLevel = userContext.userData.seller ? userContext.userData.seller.sellerLevel.nextLevel ? 
    userContext.userData.seller.sellerLevel.nextLevel.name : userContext.userData.seller.sellerLevel.name : "";

    function openPostService(): void {
        setPostService(true);
    }

    function searchHandler(): void {
        posts.resetState();
    }

    return (
        <>
            {postService && 
                <CreatePost 
                setPostService={setPostService} 
                resetState={posts.resetState} 
            />}
            <div className="flex">
                <div className="h-[calc(100vh-90px)] w-[360px] bg-main-white border-r border-light-border-gray p-[22.5px]">
                    <button onClick={openPostService} className="btn-primary text-main-white bg-main-blue w-full px-5 h-[45px] 
                    hover:bg-main-blue-hover flex items-center justify-center gap-2 mb-[50.5px]">
                        <img src={AddIcon} alt="" className="w-[16px] h-[16px]" />
                        Create new post
                    </button>
                    {userContext.userData.seller &&
                    <>
                        <h2 className="text-[20px] mb-[22px]">Your experience</h2>
                        <SellerExperience
                            level={userContext.userData.seller.sellerLevel.name}
                            nextLevel={nextLevel}
                            sellerXP={userContext.userData.seller.sellerXP}
                            nextLevelXP={nextLevelXP}
                        />
                    </>}
                    <h2 className="text-[20px] mb-[22px]">Filters</h2>
                    <div className="overflow-y-scroll pr-[5px]" style={{ maxHeight: userContext.userData.seller ? 
                    "calc(100vh - 456px)" : "calc(100% - 148px)" }}>
                        <div className="flex items-center gap-3 pb-5 mb-5 min-[1683px]:hidden border-b border-light-border-gray">
                            <Price
                                value={min} 
                                title="min price" 
                            />
                            <div>-</div>
                            <Price 
                                value={max} 
                                title="max price" 
                            />
                        </div>
                        <div className="border-b border-very-light-gray pb-5 mb-5 min-[1309px]:hidden">
                            <CountriesDropdown 
                                countryRef={countryRef} 
                                selected="Any country"
                                styles="w-full"
                                title="Seller lives in"
                                anyLocation={true}
                            />
                        </div>
                        <DeliveryTimes 
                            loading={posts.loading} 
                            searchHandler={searchHandler} 
                            deliveryTime={deliveryTime} 
                        />
                        <h3 className="text-side-text-gray mt-5 mb-3 text-[16px]">Seller speaks</h3>
                        <SearchLanguages 
                            setSelectedLanguages={setSelectedLanguages} 
                            selectedLanguages={selectedLanguages}
                            searchBarStyles="h-10"
                            styles="border-b border-light-gray pb-6"
                            applyChanges={{
                                callback: searchHandler,
                                disabled: posts.loading
                            }}
                        />
                        <SellerLevels 
                            setAllSellerLevels={setAllSellerLevels} 
                            disabled={posts.loading} 
                            searchHandler={searchHandler}
                        />
                        <ExtraFilters />
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="border-b border-b-very-light-gray bg-white">
                        <MainFiltersBar
                            searchRef={searchRef}
                            min={min}
                            max={max}
                            countryRef={countryRef}
                            sort={sort}
                            loading={posts.loading}
                            searchHandler={searchHandler}
                        />
                    </div>
                    <div className="h-[calc(100vh-180px)] overflow-y-scroll" ref={pageRef}>
                        <FilterPostsContext.Provider value={{ 
                            setPage, search: searchRef.current?.value, 
                            endpoint: `/api${urlPrefix}${location.pathname}`,
                            cursor, 
                            posts, 
                            page
                        }}>
                            {children}
                        </FilterPostsContext.Provider>
                    </div>
                </div>
            </div>
        </>
    )
}

function SellerLevels({ setAllSellerLevels, disabled, searchHandler }: SellerLevelsProps) {
    const [applyChangesBtn, setApplyChangesBtn] = useState<boolean>(false);

    function updateSellerLevels(sellerLevel: string): void {
        setApplyChangesBtn(true);
        setAllSellerLevels((cur) => {
            if (cur.includes(sellerLevel)) return cur.filter((level: string) => level !== sellerLevel);
            else return [...cur, sellerLevel];
        });
    }

    function applyChanges() {
        searchHandler();
        setApplyChangesBtn(false);
    }

    return (
        <>
            <h3 className="text-side-text-gray mt-5 mb-3 text-[16px]">Seller level</h3>
            <div className="flex flex-col gap-3 border-b border-light-gray pb-6">
                {sellerLevels.map((sellerLevel: string, index: number) => {
                    return (
                        <div className="flex items-center gap-3" key={index}>
                            <input 
                                type="checkbox" 
                                name="seller-level" 
                                className="w-[15px] h-[15px] mt-[1px]" 
                                id={sellerLevel}
                                onClick={() => updateSellerLevels(sellerLevel)}
                            />
                            <label htmlFor={sellerLevel} className="text-[15px] seller-level" style={sellerLevelTextStyles[sellerLevel]}>
                                {sellerLevel}
                            </label>
                        </div>
                    )
                })}
                {applyChangesBtn &&
                <button className={`main-btn w-fit px-3 !h-9 !text-[14px] mt-2 ${disabled ? "invalid-button" : ""}`} 
                onClick={applyChanges}>
                    Apply changes
                </button>}
            </div>
        </>
    )
}

function DeliveryTimes({ loading, searchHandler, deliveryTime }: DeliveryTimesProps) {
    function updateDeliveryTime(newDeliveryTime: number): void {
        deliveryTime.current = newDeliveryTime;
        searchHandler();
    }

    return (
        <>
            <h3 className="text-side-text-gray mb-3 text-[16px]">Delivery time</h3>
            <div className="flex flex-col gap-2 border-b border-light-gray pb-5">
                {Object.keys(deliveryTimes).map((cur: string, index: number) => {
                    return (
                        <div className="flex items-center gap-3" key={index}>
                            <input 
                                type="radio" 
                                name="delivery-time" 
                                className={`w-[15px] h-[15px] mt-[1px] ${loading ? "invalid-button" : ""}`}
                                id={cur}
                                defaultChecked={deliveryTimes[cur] === deliveryTime.current}
                                onChange={() => updateDeliveryTime(deliveryTimes[cur])}
                            />
                            <label htmlFor={cur} className="text-[15px]">
                                {cur}
                            </label>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

function ExtraFilters() {
    return (
        <>
            <h3 className="text-side-text-gray mt-5 mb-3 text-[16px]">Extra</h3>
            <div className="flex flex-col gap-2 border-b border-light-gray pb-5">
                {extraFilters.map((filter: string, index: number) => {
                    return (
                        <div className="flex items-center gap-3" key={index}>
                            <input 
                                type="checkbox" 
                                name="seller-level" 
                                className="w-[15px] h-[15px] mt-[1px]" 
                                id={filter}
                            />
                            <label htmlFor={filter} className="text-[15px]">
                                {filter}
                            </label>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

function MainFiltersBar({ searchRef, min, max, countryRef, sort, loading, searchHandler }: MainFiltersBarProps) {
    return (
        <div className="h-[90px] max-w-[1494px] m-auto flex items-center px-[22.5px]">
            <div className="flex flex-grow items-center border-r border-light-gray h-full pr-6">
                <img src={SearchIcon} alt="" className="w-[17px] h-[17px] cursor-pointer"/>
                <input 
                    type="text" 
                    placeholder="Search for post" 
                    className="flex-grow focus:outline-none placeholder-side-text-gray ml-3" 
                    ref={searchRef}
                />
            </div>
            <div className="h-full border-r border-very-light-gray px-6 flex items-center gap-3 max-[1682px]:hidden">
                <Price 
                    value={min} 
                    title="min price" 
                />
                <div>-</div>
                <Price 
                    value={max} 
                    title="max price" 
                />
            </div>
            <div className="h-full border-r border-very-light-gray px-6 flex items-center max-[1308px]:hidden">
                <CountriesDropdown 
                    countryRef={countryRef} 
                    selected="Any country"
                    styles="w-[240px]"
                    title="Seller lives in"
                    anyLocation={true}
                />
            </div>
            <div className="h-full border-r border-very-light-gray px-6 flex items-center">
                <SortBy sortBy={sort} />
            </div>
            <div className="pl-[22.5px]">
                <button className={`btn-primary text-main-white bg-main-blue w-[160px] h-[45px] hover:bg-main-blue-hover
                ${loading ? "invalid-button" : ""}`}
                onClick={searchHandler}>
                    Search
                </button>
            </div>
        </div>
    )
}

export default FilterPostsProvider;
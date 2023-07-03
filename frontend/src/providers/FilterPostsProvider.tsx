import SearchIcon from '../assets/search.png';
import Price from '../components/Price';
import { useRef, createContext, useState, useContext } from 'react';
import { MAX_PRICE, MAX_DELIVERY_DAYS } from '../views/CreatePost/Package';
import { usePaginatePosts } from '../hooks/usePaginatePosts';
import { IPost } from '../models/IPost';
import { sortPosts } from '../utils/sortPosts';
import { PaginatePosts } from '../types/PaginatePosts';
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

interface FilterPostsContextProps {
    children?: React.ReactNode,
}

type filterPosts = {
    cursor: React.MutableRefObject<string | undefined>,
    posts: PaginatePosts<IPost> | undefined,
    endpoint: string,
    page: { value: number },
    setPage: React.Dispatch<React.SetStateAction<{ value: number }>>
}

export const FilterPostsContext = createContext<filterPosts | undefined>(undefined);

function FilterPostsProvider({ children }: FilterPostsContextProps) {
    const cursor = useRef<string>("");
    const min = useRef<number>(0);
    const max = useRef<number>(MAX_PRICE);
    const sort = useRef<string>("most recent");
    const deliveryTime = useRef<number>(MAX_DELIVERY_DAYS);
    const location = useLocation();
    
    const searchRef = useRef<HTMLInputElement>(null);
    const countryRef = useRef<HTMLSelectElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const [postService, setPostService] = useState<boolean>(false);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const userContext = useContext(UserContext);

    const posts = usePaginatePosts<IPost>(
        pageRef, 
        cursor,
        `/api/users${location.pathname}`,
        page,
        setPage,
        {
            search: searchRef.current?.value,
            sort: sortPosts[sort.current],
            min: min.current,
            max: max.current,
            location: countryRef.current?.value === "Any country" ? undefined : countryRef.current?.value,
            languages: selectedLanguages,
            deliveryTime: deliveryTime.current
        }
    );

    function openPostService(): void {
        setPostService(true);
    }

    function searchHandler(): void {
        posts.resetState();
    }

    function updateDeliveryTime(newDeliveryTime: number): void {
        deliveryTime.current = newDeliveryTime;
        searchHandler();
    }

    return (
        <>
            {postService && 
                <CreatePost 
                setPostService={setPostService} 
                resetState={posts.resetState} 
            />}
            <div className="flex">
                <div className="h-[calc(100vh-90px)] w-[380px] bg-main-white border-r border-light-border-gray p-7">
                    <button onClick={openPostService} className="btn-primary text-main-white bg-main-blue w-full px-5 h-[45px] 
                    hover:bg-main-blue-hover flex items-center justify-center gap-2 mb-[45px]">
                        <img src={AddIcon} alt="" className="w-[16px] h-[16px]" />
                        Create new post
                    </button>
                    {userContext.userData.seller &&
                    <>
                        <h2 className="text-[20px] mb-[22px]">Your experience</h2>
                        <div className="mb-7">
                            <div className="flex items-center justify-between w-full mb-2">
                                <p className="text-[15px] text-[#610df2] text-center">{userContext.userData.seller.sellerLevel.name}</p>
                                <p className="text-[15px] text-[#f20d45] text-center">Amateur Seller</p>
                            </div>
                            <div className="rounded-full w-full bg-very-light-gray h-[22px] overflow-hidden">
                                <div className="w-[80%] bg-main-blue h-full rounded-full flex items-center justify-center">
                                    <p className="text-main-white text-[14px]">{`${userContext.userData.seller.sellerXP}xp`}</p>
                                </div>
                            </div>
                        </div>
                    </>}
                    <h2 className="text-[20px] mb-7">More filters</h2>
                    <div className="overflow-y-scroll max-h-[calc(100%-148px)] pr-[5px]">
                        <h3 className="text-side-text-gray pt-5 border-t border-light-border-gray mb-3 text-[16px]">Delivery time</h3>
                        <div className="flex flex-col gap-2 border-b border-light-gray pb-5">
                            {Object.keys(deliveryTimes).map((cur: string, index: number) => {
                                return (
                                    <div className="flex items-center gap-3" key={index}>
                                        <input 
                                            type="radio" 
                                            name="delivery-time" 
                                            className={`w-[15px] h-[15px] mt-[1px] ${posts.loading ? "invalid-button" : ""}`}
                                            id={cur}
                                            defaultChecked={deliveryTimes[cur] === deliveryTime.current}
                                            onChange={() => updateDeliveryTime(deliveryTimes[cur])}
                                        />
                                        <label htmlFor={cur}>
                                            {cur}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
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
                        <h3 className="text-side-text-gray mt-5 mb-3 text-[16px]">Seller level</h3>
                        <div className="flex flex-col gap-2 border-b border-light-gray pb-5">
                            {Object.keys(sellerLevels).map((sellerLevel: string, index: number) => {
                                return (
                                    <div className="flex items-center gap-3" key={index}>
                                        <input 
                                            type="checkbox" 
                                            name="seller-level" 
                                            className="w-[15px] h-[15px] mt-[1px]" 
                                            id={sellerLevel}
                                        />
                                        <label htmlFor={sellerLevel}>
                                            {sellerLevel}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                        <h3 className="text-side-text-gray mt-5 mb-3 text-[16px]">Extra</h3>
                        <div className="flex flex-col gap-2 border-b border-light-gray pb-5">
                            {extraFilters.map((filter, index) => {
                                return (
                                    <div className="flex items-center gap-3" key={index}>
                                        <input 
                                            type="checkbox" 
                                            name="seller-level" 
                                            className="w-[15px] h-[15px] mt-[1px]" 
                                            id={filter.filterName}
                                            checked={filter.isChecked}
                                        />
                                        <label htmlFor={filter.filterName}>
                                            {filter.filterName}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="border-b border-b-very-light-gray bg-white">
                        <div className="h-[90px] max-w-screen-xxl m-auto flex items-center px-7">
                            <div className="flex flex-grow items-center border-r border-light-gray h-full pr-6">
                                <img src={SearchIcon} alt="" className="w-[17px] h-[17px] cursor-pointer"/>
                                <input 
                                    type="text" 
                                    placeholder="Search for post" 
                                    className="flex-grow focus:outline-none placeholder-side-text-gray ml-3" 
                                    ref={searchRef}
                                />
                            </div>
                            <div className="h-full border-r border-very-light-gray px-6 flex items-center gap-3">
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
                            <div className="h-full border-r border-very-light-gray px-6 flex items-center">
                                <CountriesDropdown 
                                    countryRef={countryRef} 
                                    selected={"Any country"}
                                    styles="max-w-[300px]"
                                    title="Seller lives in"
                                    anyLocation={true}
                                />
                            </div>
                            <div className="h-full border-r border-very-light-gray px-6 flex items-center">
                                <SortBy sortBy={sort} />
                            </div>
                            <div className="pl-6">
                                <button className="btn-primary text-main-white bg-main-blue w-[160px] h-[45px] hover:bg-main-blue-hover"
                                onClick={searchHandler}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="h-[calc(100vh-180px)] overflow-y-scroll" ref={pageRef}>
                        <FilterPostsContext.Provider value={{ cursor, posts, page, setPage, endpoint: `/api/users${location.pathname}` }}>
                            {children}
                        </FilterPostsContext.Provider>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilterPostsProvider;
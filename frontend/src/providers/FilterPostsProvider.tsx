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
import { sellerLevelTextStyles } from '../utils/sellerLevelTextStyles';

interface FilterPostsContextProps {
    children?: React.ReactNode,
}

interface SellerLevelsProps {
    setAllSellerLevels: React.Dispatch<React.SetStateAction<string[]>>,
    disabled: boolean,
    searchHandler: () => void
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
    const [allSellerLevels, setAllSellerLevels] = useState<string[]>([]);
    const userContext = useContext(UserContext);

    const nextLevelXP = userContext.userData.seller ? userContext.userData.seller.sellerLevel.nextLevel ? 
    userContext.userData.seller.sellerLevel.nextLevel.xpRequired : userContext.userData.seller.sellerXP : 0;

    const nextSellerLevel = userContext.userData.seller ? userContext.userData.seller.sellerLevel.nextLevel ? 
    userContext.userData.seller.sellerLevel.nextLevel.name : userContext.userData.seller.sellerLevel.name : "";

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
            deliveryTime: deliveryTime.current,
            sellerLevels: allSellerLevels
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
                <div className="h-[calc(100vh-90px)] w-[360px] bg-main-white border-r border-light-border-gray p-7">
                    <button onClick={openPostService} className="btn-primary text-main-white bg-main-blue w-full px-5 h-[45px] 
                    hover:bg-main-blue-hover flex items-center justify-center gap-2 mb-[45px]">
                        <img src={AddIcon} alt="" className="w-[16px] h-[16px]" />
                        Create new post
                    </button>
                    {userContext.userData.seller &&
                    <>
                        <h2 className="text-[20px] mb-[22px]">Your experience</h2>
                        <div className="mb-7">
                            <div className="flex items-center justify-between w-full mb-3">
                                <p className="text-[15px]" style={sellerLevelTextStyles[userContext.userData.seller.sellerLevel.name]}>
                                    {userContext.userData.seller.sellerLevel.name}
                                </p>
                                <p className="text-[15px]" style={sellerLevelTextStyles[nextSellerLevel]}>
                                    {nextSellerLevel}
                                </p>
                            </div>
                            <div className="rounded-full w-full bg-very-light-gray h-[17px] overflow-hidden">
                                <div className="bg-main-blue h-full rounded-full flex items-center justify-center"
                                style={{ width: `calc(100% / ${nextLevelXP} * ${userContext.userData.seller.sellerXP})`}}>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <p className="bg-light-green text-main-white w-fit text-[14px] px-3 py-[1px] rounded-[6px]">
                                    {`${userContext.userData.seller.sellerXP} xp`}
                                </p>
                                <p className="bg-light-green text-main-white w-fit text-[14px] px-3 py-[1px] rounded-[6px]">
                                    {`${nextLevelXP} xp`}
                                </p>
                            </div>
                        </div>
                    </>}
                    <h2 className="text-[20px] mb-[22px]">More filters</h2>
                    <div className="overflow-y-scroll pr-[5px]" style={{ maxHeight: userContext.userData.seller ? 
                    "calc(100vh - 456px)" : "calc(100% - 148px)" }}>
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
                                        <label htmlFor={cur} className="text-[15px]">
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
                        <SellerLevels 
                            setAllSellerLevels={setAllSellerLevels} 
                            disabled={posts.loading} 
                            searchHandler={searchHandler}
                        />
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
                                        <label htmlFor={filter.filterName} className="text-[15px]">
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
                        <div className="h-[90px] max-w-[1494px] m-auto flex items-center px-7">
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
                                    styles="w-[240px]"
                                    title="Seller lives in"
                                    anyLocation={true}
                                />
                            </div>
                            <div className="h-full border-r border-very-light-gray px-6 flex items-center">
                                <SortBy sortBy={sort} />
                            </div>
                            <div className="pl-6">
                                <button className={`btn-primary text-main-white bg-main-blue w-[160px] h-[45px] hover:bg-main-blue-hover
                                ${posts.loading ? "invalid-button" : ""}`}
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
            <div className="flex flex-col gap-3 border-b border-light-gray pb-5">
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
                            <label htmlFor={sellerLevel} className="text-[15px]" style={sellerLevelTextStyles[sellerLevel]}>
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

export default FilterPostsProvider;
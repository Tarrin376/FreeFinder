import Price from '../components/Price';
import { useRef, createContext, useState, useContext, useEffect } from 'react';
import { MAX_PRICE, MAX_DELIVERY_DAYS } from '../views/CreatePost/Package';
import { usePaginateData } from '../hooks/usePaginateData';
import { IPost } from '../models/IPost';
import { sortPosts } from '../utils/sortPosts';
import { useLocation } from 'react-router-dom';
import CountriesDropdown from '../components/CountriesDropdown';
import CreatePost from '../views/CreatePost/CreatePost';
import AddIcon from '../assets/add.png';
import SearchLanguages from '../components/SearchLanguages';
import { UserContext } from './UserContext';
import SellerExperience from '../components/SellerExperience';
import { FilterPosts } from '../types/FilterPosts';
import { AnimatePresence } from "framer-motion";
import ErrorPopUp from '../components/ErrorPopUp';
import { PaginationResponse } from '../types/PaginateResponse';
import MainFiltersBar from '../components/MainFiltersBar';
import SellerLevels from '../components/SellerLevels';
import DeliveryTimes from '../components/DeliveryTimes';
import TypeOfWork from '../components/TypeOfWork';
import ExtraFilters from '../components/ExtraFilters';

interface FilterPostsProviderProps {
    children?: React.ReactNode,
    urlPrefix: string
}

type PostArgs = {
    search: string | undefined,
    sort: string,
    min: number,
    max: number,
    country: string | undefined,
    languages: string[],
    deliveryTime: number,
    sellerLevels: string[],
    extraFilters: string[],
    selectedWork: string[]
}

export const FilterPostsContext = createContext<FilterPosts | undefined>(undefined);

function FilterPostsProvider({ children, urlPrefix }: FilterPostsProviderProps) {
    const postFilters = JSON.parse(sessionStorage.getItem("post_filters") ?? "{}");

    const cursor = useRef<string>();
    const [min, setMin] = useState<number>(postFilters.min ?? 0);
    const [max, setMax] = useState<number>(postFilters.max ?? MAX_PRICE);
    const sort = useRef<string>(postFilters.sort ?? "most recent");
    const deliveryTime = useRef<number>(postFilters.deliveryTime ?? MAX_DELIVERY_DAYS);
    const searchRef = useRef<HTMLInputElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const [postService, setPostService] = useState<boolean>(false);

    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(postFilters.languages ?? []);
    const [sellerLevels, setSellerLevels] = useState<string[]>(postFilters.sellerLevels ?? []);
    const [extraFilters, setExtraFilters] = useState<string[]>(postFilters.extraFilters ?? []);
    const [selectedWork, setSelectedWork] = useState<string[]>(postFilters.selectedWork ?? []);
    const [country, setCountry] = useState<string>(postFilters.country ?? "Any country");
    const userContext = useContext(UserContext);

    const location = useLocation();

    const posts = usePaginateData<PostArgs, IPost, PaginationResponse<IPost>>(
        pageRef, 
        cursor,
        `/api${urlPrefix}${location.pathname}`,
        page,
        setPage,
        {
            search: searchRef.current?.value,
            sort: sortPosts[sort.current],
            min: min,
            max: max,
            country: country === "Any country" ? undefined : country,
            languages: selectedLanguages,
            deliveryTime: deliveryTime.current,
            sellerLevels: sellerLevels,
            extraFilters: extraFilters,
            selectedWork: selectedWork
        }
    );
    
    const nextLevelXP = userContext.userData.seller?.sellerLevel.nextLevel?.xpRequired ?? userContext.userData.seller?.sellerXP ?? 0;
    const nextLevel = userContext.userData.seller?.sellerLevel.nextLevel?.name ?? "";

    function openPostService(): void {
        setPostService(true);
    }

    function searchHandler(): void {
        sessionStorage.setItem("post_filters", JSON.stringify({
            search: searchRef.current?.value,
            sort: sort.current,
            min: min,
            max: max,
            country: country,
            languages: selectedLanguages,
            deliveryTime: deliveryTime.current,
            sellerLevels: sellerLevels,
            extraFilters: extraFilters,
            selectedWork: selectedWork
        }));
        
        posts.resetState();
    };

    useEffect(() => {
        searchHandler();
    }, [selectedLanguages, selectedWork, sellerLevels, extraFilters])

    return (
        <>
            <AnimatePresence>
                {postService && 
                    <CreatePost 
                    setPostService={setPostService} 
                    resetState={posts.resetState} 
                />}
                {posts.errorMessage !== "" &&
                <ErrorPopUp
                    errorMessage={posts.errorMessage}
                    setErrorMessage={posts.setErrorMessage}
                />}
            </AnimatePresence>
            <div className="flex">
                <div className="h-[calc(100vh-90px)] w-[360px] bg-main-white border-r border-light-border-gray p-[22.5px]">
                    <button onClick={openPostService} className={`main-btn flex items-center justify-center gap-[10px] mb-[50px] 
                    ${userContext.userData.username === "" ? "invalid-button" : ""}`}>
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
                    <div className="overflow-y-scroll pr-[8px]" style={{ maxHeight: userContext.userData.seller ? "calc(100vh - 483px)" : "calc(100% - 175px)" }}>
                        <div className="flex items-center gap-3 pb-5 mb-5 min-[1683px]:hidden border-b border-light-border-gray">
                            <Price
                                value={min} 
                                maxValue={MAX_PRICE}
                                title="min price" 
                                setValue={setMin}
                            />
                            <div>-</div>
                            <Price 
                                value={max} 
                                maxValue={MAX_PRICE}
                                title="max price" 
                                setValue={setMax}
                            />
                        </div>
                        <div className="border-b border-light-border-gray pb-5 mb-5 min-[1309px]:hidden">
                            <CountriesDropdown 
                                country={country}
                                setCountry={setCountry}
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
                        <h3 className="text-side-text-gray mt-4 mb-2 text-[16px]">
                            Seller speaks
                        </h3>
                        <SearchLanguages 
                            loading={posts.loading}
                            setSelectedLanguages={setSelectedLanguages} 
                            selectedLanguages={selectedLanguages}
                            searchBarStyles="h-10"
                            styles="border-b border-light-border-gray pb-6"
                        />
                        <SellerLevels 
                            loading={posts.loading}
                            sellerLevels={sellerLevels}
                            setSellerLevels={setSellerLevels} 
                        />
                        <TypeOfWork 
                            selectedWork={selectedWork}
                            setSelectedWork={setSelectedWork}
                        />
                        <ExtraFilters 
                            loading={posts.loading}
                            extraFilters={extraFilters}
                            setExtraFilters={setExtraFilters}
                        />
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="border-b border-b-light-border-gray bg-white pr-[14px]">
                        <MainFiltersBar
                            searchRef={searchRef}
                            min={min}
                            setMin={setMin}
                            max={max}
                            setMax={setMax}
                            country={country}
                            setCountry={setCountry}
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

export default FilterPostsProvider;
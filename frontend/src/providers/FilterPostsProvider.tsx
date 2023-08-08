import Price from '../components/Price';
import { useRef, createContext, useState, useContext, useEffect, cloneElement, useReducer } from 'react';
import { MAX_SERVICE_PRICE, MAX_SERVICE_DELIVERY_DAYS } from '@freefinder/shared/dist/constants';
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
import { SearchOption } from 'src/types/SearchOptions';
import { PostArgs } from 'src/types/PostArgs';
import { sortPostsOption } from 'src/types/sortPostsOption';

interface FilterPostsProviderProps {
    children: React.ReactElement,
    urlPrefix: string
}

export type FilterPostsProviderState = {
    min: number,
    max: number,
    sort: sortPostsOption,
    search: string,
    selectedLanguages: string[],
    sellerLevels: string[],
    extraFilters: string[],
    selectedWork: string[],
    searchOption: SearchOption,
    country: string
}

export const FilterPostsContext = createContext<FilterPosts | undefined>(undefined);

function FilterPostsProvider({ children, urlPrefix }: FilterPostsProviderProps) {
    const postFilters = useRef<PostArgs>(JSON.parse(sessionStorage.getItem("post_filters") ?? "{}"));
    const deliveryTime = useRef<number>(postFilters.current.deliveryTime ?? MAX_SERVICE_DELIVERY_DAYS);
    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();

    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const [postService, setPostService] = useState<boolean>(false);

    const userContext = useContext(UserContext);
    const location = useLocation();

    const [state, dispatch] = useReducer((cur: FilterPostsProviderState, payload: Partial<FilterPostsProviderState>) => {
        return { ...cur, ...payload };
    }, {
        min: postFilters.current.min ?? 0,
        max: postFilters.current.max ?? MAX_SERVICE_PRICE,
        sort: postFilters.current.sort as sortPostsOption ?? "most recent",
        search: postFilters.current.search ?? "",
        selectedLanguages: postFilters.current.languages ?? [],
        sellerLevels: postFilters.current.sellerLevels ?? [],
        extraFilters: postFilters.current.extraFilters ?? [],
        selectedWork: postFilters.current.selectedWork ?? [],
        searchOption: postFilters.current.searchOption ?? "Work type",
        country: "Any country"
    });

    const posts = usePaginateData<PostArgs, IPost, PaginationResponse<IPost>>(
        pageRef, 
        cursor,
        `/api${urlPrefix}${location.pathname}`,
        page,
        setPage,
        {
            search: state.search,
            sort: sortPosts[state.sort],
            min: state.min,
            max: state.max,
            country: state.country === "Any country" ? undefined : state.country,
            languages: state.selectedLanguages,
            deliveryTime: deliveryTime.current,
            sellerLevels: state.sellerLevels,
            extraFilters: state.extraFilters,
            selectedWork: state.selectedWork,
            searchOption: state.searchOption
        }
    );
    
    const nextLevelXP = userContext.userData.seller?.sellerLevel.nextLevel?.xpRequired ?? userContext.userData.seller?.sellerXP ?? 0;
    const nextLevel = userContext.userData.seller?.sellerLevel.nextLevel?.name ?? "";

    function openPostService(): void {
        setPostService(true);
    }

    function searchHandler(): void {
        sessionStorage.setItem("post_filters", JSON.stringify({
            search: state.search,
            sort: state.sort,
            min: state.min,
            max: state.max,
            country: state.country,
            languages: state.selectedLanguages,
            deliveryTime: deliveryTime.current,
            sellerLevels: state.sellerLevels,
            extraFilters: state.extraFilters,
            selectedWork: state.selectedWork,
            searchOption: state.searchOption
        }));
        
        posts.resetState();
    };

    useEffect(() => {
        searchHandler();
    }, [state.selectedLanguages, state.selectedWork, state.sellerLevels, state.extraFilters]);

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
                                value={state.min} 
                                maxValue={MAX_SERVICE_PRICE}
                                title="min price" 
                                updateValue={(cur: number) => dispatch({ min: cur })}
                            />
                            <div>-</div>
                            <Price 
                                value={state.max} 
                                maxValue={MAX_SERVICE_PRICE}
                                title="max price" 
                                updateValue={(cur: number) => dispatch({ max: cur })}
                            />
                        </div>
                        <div className="border-b border-light-border-gray pb-5 mb-5">
                            <CountriesDropdown 
                                country={state.country}
                                updateCountry={(country: string) => dispatch({ country: country })}
                                styles="w-full text-[15px]"
                                title="Seller lives in"
                                anyLocation={true}
                            />
                        </div>
                        <DeliveryTimes 
                            loading={posts.loading} 
                            searchHandler={searchHandler} 
                            deliveryTime={deliveryTime} 
                        />
                        <h3 className="text-side-text-gray mt-5 mb-2 text-[16px]">
                            Seller speaks
                        </h3>
                        <SearchLanguages 
                            loading={posts.loading}
                            updateLanguages={(languages: string[]) => dispatch({ selectedLanguages: languages })}
                            selectedLanguages={state.selectedLanguages}
                            searchBarStyles="h-10"
                            styles="border-b border-light-border-gray pb-5"
                        />
                        <SellerLevels 
                            loading={posts.loading}
                            sellerLevels={state.sellerLevels}
                            updateSellerLevels={(sellerLevels: string[]) => dispatch({ sellerLevels: sellerLevels })} 
                        />
                        <TypeOfWork 
                            selectedWork={state.selectedWork}
                            updateSelectedWork={(selectedWork: string[]) => dispatch({ selectedWork: selectedWork })}
                        />
                        <ExtraFilters 
                            loading={posts.loading}
                            extraFilters={state.extraFilters}
                            updateExtraFilters={(extraFilters: string[]) => dispatch({ extraFilters: extraFilters })}
                        />
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="border-b border-b-light-border-gray bg-white pr-[14px]">
                        <MainFiltersBar
                            dispatch={dispatch}
                            state={state}
                            loading={posts.loading}
                            searchHandler={searchHandler}
                        />
                    </div>
                    <div className="h-[calc(100vh-180px)] overflow-y-scroll" ref={pageRef}>
                        <FilterPostsContext.Provider value={{ 
                            setPage, search: state.search, 
                            endpoint: `/api${urlPrefix}${location.pathname}`,
                            cursor, 
                            posts, 
                            page
                        }}>
                            {cloneElement(children, { 
                                posts: posts.data, 
                                loading: posts?.loading,
                                count: posts?.count
                            })}
                        </FilterPostsContext.Provider>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilterPostsProvider;
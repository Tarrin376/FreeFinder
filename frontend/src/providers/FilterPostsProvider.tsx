import { useRef, createContext, useState, useEffect, cloneElement, useReducer } from 'react';
import { MAX_SERVICE_PRICE, MAX_SERVICE_DELIVERY_DAYS } from '@freefinder/shared/dist/constants';
import { usePaginateData } from '../hooks/usePaginateData';
import { IPost } from '../models/IPost';
import { sortPosts } from '../utils/sortPosts';
import { useLocation } from 'react-router-dom';
import CreatePost from '../views/CreatePost/CreatePost';
import { FilterPosts } from '../types/FilterPosts';
import { AnimatePresence } from "framer-motion";
import ErrorPopUp from '../components/ErrorPopUp';
import { PaginationResponse } from '../types/PaginateResponse';
import MainFiltersBar from '../components/MainFiltersBar';
import { SearchOption } from 'src/types/SearchOptions';
import { PostArgs } from 'src/types/PostArgs';
import { sortPostsOption } from 'src/types/sortPostsOption';
import PostsSidebar from 'src/components/PostsSidebar';
import FiltersPopUp from 'src/components/FiltersPopUp';
import { useWindowSize } from 'src/hooks/useWindowSize';

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
    country: string,
    filtersPopUp: boolean
}

export const FilterPostsContext = createContext<FilterPosts | undefined>(undefined);

function FilterPostsProvider({ children, urlPrefix }: FilterPostsProviderProps) {
    const postFilters = useRef<PostArgs>(JSON.parse(sessionStorage.getItem("post_filters") ?? "{}"));
    const deliveryTime = useRef<number>(postFilters.current.deliveryTime ?? MAX_SERVICE_DELIVERY_DAYS);
    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();

    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const [postService, setPostService] = useState<boolean>(false);

    const location = useLocation();
    const windowSize = useWindowSize();

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
        country: "Any country",
        filtersPopUp: false
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

    function openPostService(): void {
        setPostService(true);
    }

    function toggleFiltersPopUp(): void {
        dispatch({ filtersPopUp: !state.filtersPopUp });
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
                {state.filtersPopUp && 
                <FiltersPopUp 
                    loading={posts.loading}
                    deliveryTime={deliveryTime}
                    searchHandler={searchHandler}
                    dispatch={dispatch}
                    toggleFiltersPopUp={toggleFiltersPopUp}
                    state={state}
                />}
            </AnimatePresence>
            <div className="flex">
                {windowSize >= 1180 &&
                <PostsSidebar
                    loading={posts.loading}
                    openPostService={openPostService}
                    deliveryTime={deliveryTime}
                    searchHandler={searchHandler}
                    dispatch={dispatch}
                    state={state}
                />}
                <div className="flex-grow">
                    <div className="border-b border-b-light-border-gray bg-white">
                        <MainFiltersBar
                            dispatch={dispatch}
                            state={state}
                            loading={posts.loading}
                            searchHandler={searchHandler}
                            toggleFiltersPopUp={toggleFiltersPopUp}
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
import { useRef, createContext, useState, cloneElement, useReducer, useCallback, useEffect } from 'react';
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
import AddIcon from "../assets/add.png";

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
    deliveryTime: number,
    country: string
}

export const defaultStateValues: FilterPostsProviderState = {
    min: 0,
    max: MAX_SERVICE_PRICE,
    sort: "most recent",
    search: "",
    selectedLanguages: [],
    sellerLevels: [],
    extraFilters: [],
    selectedWork: [],
    searchOption: "Work type",
    deliveryTime: MAX_SERVICE_DELIVERY_DAYS,
    country: "Any country"
}

export const FilterPostsContext = createContext<FilterPosts | undefined>(undefined);

function FilterPostsProvider({ children, urlPrefix }: FilterPostsProviderProps) {
    const postFilters = useRef<PostArgs>(JSON.parse(sessionStorage.getItem("post_filters") ?? "{}"));
    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();

    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const [filtersPopUp, setFiltersPopUp] = useState<boolean>(false);
    const [postServicePopUp, setPostServicePopUp] = useState<boolean>(false);

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
        deliveryTime: postFilters.current.deliveryTime ?? MAX_SERVICE_DELIVERY_DAYS,
        country: "Any country"
    });

    const getModifiedFiltersCount = useCallback((): number => {
        let count = 0;
        for (const key of Object.keys(state)) {
            const keyValue = key as keyof FilterPostsProviderState;

            if (keyValue !== "search" && keyValue !== "searchOption" && keyValue !== "sort") {
                const curValue = state[keyValue];
                const defaultValue = defaultStateValues[keyValue];

                if ((Array.isArray(curValue) && curValue.length > 0) || (!Array.isArray(curValue) && curValue !== defaultValue)) {
                    count++;
                }
            }
        }

        return count;
    }, [state]);

    const [modifiedFiltersCount, setModifiedFiltersCount] = useState<number>(getModifiedFiltersCount());
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
            deliveryTime: state.deliveryTime,
            sellerLevels: state.sellerLevels,
            extraFilters: state.extraFilters,
            selectedWork: state.selectedWork,
            searchOption: state.searchOption
        }
    );

    function updatePostServicePopUp(val: boolean): void {
        setPostServicePopUp(val);
    }

    function toggleFiltersPopUp(): void {
        setFiltersPopUp((cur) => !cur);
    }

    function searchHandler(): void {
        sessionStorage.setItem("post_filters", JSON.stringify({
            search: state.search,
            sort: state.sort,
            min: state.min,
            max: state.max,
            country: state.country,
            languages: state.selectedLanguages,
            deliveryTime: state.deliveryTime,
            sellerLevels: state.sellerLevels,
            extraFilters: state.extraFilters,
            selectedWork: state.selectedWork,
            searchOption: state.searchOption
        }));
        
        posts.resetState();
    }

    function clearFilters(): void {
        dispatch({
            min: 0,
            max: MAX_SERVICE_PRICE,
            sort: "most recent",
            search: "",
            selectedLanguages: [],
            sellerLevels: [],
            extraFilters: [],
            selectedWork: [],
            deliveryTime: MAX_SERVICE_DELIVERY_DAYS,
            searchOption: "Work type",
            country: "Any country"
        });
    }

    useEffect(() => {
        if (windowSize < 1015) {
            posts.resetState();
        }
    }, [state.sort]);
    
    return (
        <>
            <AnimatePresence>
                {postServicePopUp && 
                <CreatePost 
                    updatePostServicePopUp={updatePostServicePopUp} 
                    resetState={posts.resetState} 
                />}
                {posts.errorMessage !== "" &&
                <ErrorPopUp
                    errorMessage={posts.errorMessage}
                    setErrorMessage={posts.setErrorMessage}
                />}
                {filtersPopUp && 
                <FiltersPopUp 
                    loading={posts.loading}
                    searchHandler={searchHandler}
                    dispatch={dispatch}
                    toggleFiltersPopUp={toggleFiltersPopUp}
                    state={state}
                    clearFilters={clearFilters}
                    modifiedFiltersCount={modifiedFiltersCount}
                    setModifiedFiltersCount={setModifiedFiltersCount}
                    getModifiedFiltersCount={getModifiedFiltersCount}
                />}
            </AnimatePresence>
            <div className="flex">
                {windowSize >= 1245 ?
                <PostsSidebar
                    loading={posts.loading}
                    updatePostServicePopUp={updatePostServicePopUp}
                    dispatch={dispatch}
                    state={state}
                    clearFilters={clearFilters}
                /> : 
                <div>
                    <button className={`main-btn flex items-center justify-center rounded-full w-[50px] !h-[50px] z-30 shadow-post fixed 
                    ${windowSize < 560 ? windowSize < 400 ? "right-3 bottom-3" : "right-5 bottom-5" : "right-7 bottom-7"}`} 
                    onClick={() => updatePostServicePopUp(true)}>
                        <img src={AddIcon} alt="" className="w-[21px] h-[21px]" />
                    </button>
                </div>}
                <MainFiltersBar
                    dispatch={dispatch}
                    state={state}
                    loading={posts.loading}
                    searchHandler={searchHandler}
                    toggleFiltersPopUp={toggleFiltersPopUp}
                    modifiedFiltersCount={modifiedFiltersCount}
                    pageRef={pageRef}
                >
                    <FilterPostsContext.Provider value={{ 
                        setPage, search: state.search, 
                        endpoint: `/api${urlPrefix}${location.pathname}`,
                        cursor: cursor, 
                        posts: posts, 
                        page: page
                    }}>
                        {cloneElement(children, { 
                            posts: posts.data, 
                            loading: posts?.loading,
                            count: posts?.count
                        })}
                    </FilterPostsContext.Provider>
                </MainFiltersBar>
            </div>
        </>
    )
}

export default FilterPostsProvider;
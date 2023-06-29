import SearchIcon from '../assets/search.png';
import Price from '../components/Price';
import { useRef, createContext, useState } from 'react';
import { MAX_PRICE } from '../views/CreatePost/Package';
import { usePaginatePosts } from '../hooks/usePaginatePosts';
import { IPost } from '../models/IPost';
import { sortPosts } from '../utils/sortPosts';
import { PaginateData } from '../types/PaginateData';
import { useLocation } from 'react-router-dom';
import SortBy from '../components/SortBy';
import CountriesDropdown from '../components/CountriesDropdown';

interface FilterPostsContextProps {
    children?: React.ReactNode
}

type filterPosts = {
    cursor: React.MutableRefObject<string>,
    posts: PaginateData<IPost> | undefined,
    minPrice: React.MutableRefObject<number>,
    maxPrice: React.MutableRefObject<number>,
    sortBy: React.MutableRefObject<string>,
    endpoint: string,
    nextPage: { pageNumber: number },
    setNextPage: React.Dispatch<React.SetStateAction<{ pageNumber: number }>>
}

export const FilterPostsContext = createContext<filterPosts | undefined>(undefined);

function FilterPostsProvider({ children }: FilterPostsContextProps) {
    const cursor = useRef<string>("HEAD");
    const pageRef = useRef<HTMLDivElement>(null);
    const minPrice = useRef<number>(0);
    const maxPrice = useRef<number>(MAX_PRICE);
    const sortBy = useRef<string>("most recent");
    const location = useLocation();
    const searchRef = useRef<HTMLInputElement>(null);
    const countryRef = useRef<HTMLSelectElement>(null);
    const [nextPage, setNextPage] = useState<{ pageNumber: number }>({ pageNumber: 1 });

    const defaultCountry = "🇬🇧 United Kingdom";
    const search = searchRef.current?.value !== undefined ? searchRef.current.value : "";
    const sellerLocation = countryRef.current?.value ? countryRef.current.value : defaultCountry;

    const posts = usePaginatePosts<IPost>(
        pageRef, 
        cursor, 
        `/api/users${location.pathname}?search=${search}&sort=${sortPosts[sortBy.current]}&min=${minPrice.current}&max=${maxPrice.current}&location=${sellerLocation}`,
        nextPage,
        setNextPage
    );

    return (
        <div ref={pageRef}>
            <div className="border-b border-b-very-light-gray bg-white px-20">
                <div className="max-w-screen-xxl m-auto h-[90px] flex items-center">
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
                            value={minPrice} 
                            title="min price" 
                        />
                        <div>-</div>
                        <Price 
                            value={maxPrice} 
                            title="max price" 
                        />
                    </div>
                    <div className="h-full border-r border-very-light-gray px-6 flex items-center">
                        <CountriesDropdown 
                            countryRef={countryRef} 
                            selected={defaultCountry}
                            styles="max-w-[300px]"
                            title="Seller location"
                        />
                    </div>
                    <div className="h-full border-r border-very-light-gray px-6 flex items-center">
                        <SortBy sortBy={sortBy} />
                    </div>
                    <div className="pl-6">
                        <button className="btn-primary text-main-white bg-main-blue w-[160px] h-[45px] hover:bg-main-blue-hover"
                        onClick={posts.resetState}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <FilterPostsContext.Provider value={{ 
                cursor, posts, minPrice, maxPrice, 
                sortBy, nextPage, setNextPage, 
                endpoint: `/api/users${location.pathname}` 
            }}>
                {children}
            </FilterPostsContext.Provider>
        </div>
    )
}

export default FilterPostsProvider;
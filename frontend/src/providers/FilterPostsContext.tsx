import SearchIcon from '../assets/search.png';
import Price from '../components/Price';
import { useRef, useEffect, createContext } from 'react';
import { MAX_PRICE } from '../views/CreatePost/Package';
import { usePaginateData } from '../hooks/usePaginateData';
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
    endpoint: string
}

export const FilterPostsContext = createContext<filterPosts | undefined>(undefined);

function FilterPostsProvider({ children }: FilterPostsContextProps) {
    const cursor = useRef<string>("");
    const pageRef = useRef<HTMLDivElement>(null);
    const minPrice = useRef<number>(0);
    const maxPrice = useRef<number>(MAX_PRICE);
    const sortBy = useRef<string>(sortPosts["most recent"]);
    const location = useLocation();
    const posts = usePaginateData<IPost>(pageRef, `/api/users${location.pathname}?sort=${sortPosts[sortBy.current]}`, cursor);
    const countryRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        posts.setPosts([]);
        posts.setReachedBottom(false);
    }, [location.pathname])

    return (
        <div ref={pageRef}>
            <div className="border-b border-b-very-light-gray bg-white px-20">
                <div className="max-w-screen-xxl m-auto h-[90px] flex items-center">
                    <div className="flex flex-grow items-center border-r border-light-gray h-full pr-6">
                        <img src={SearchIcon} alt="" className="w-[17px] h-[17px] cursor-pointer"/>
                        <input type="text" placeholder="Search for post" className="flex-grow focus:outline-none placeholder-side-text-gray ml-3" />
                    </div>
                    <div className="h-full border-r border-very-light-gray px-6 flex items-center gap-3">
                        <Price value={minPrice} title="min price" />
                        <div>-</div>
                        <Price value={maxPrice} title="max price" />
                    </div>
                    <div className="h-full border-r border-very-light-gray px-6 flex items-center">
                        <CountriesDropdown 
                            countryRef={countryRef} 
                            selected="🇬🇧 United Kingdom"
                            styles="!drop-shadow-none max-w-[300px]"
                            title="Seller location"
                        />
                    </div>
                    <div className="h-full border-r border-very-light-gray px-6 flex items-center">
                        <SortBy
                            cursor={cursor} 
                            sortBy={sortBy} 
                            setPosts={posts.setPosts} 
                            setReachedBottom={posts.setReachedBottom} 
                            head="" 
                            loading={posts.loading}
                        />
                    </div>
                    <div className="pl-6">
                        <button className="btn-primary text-main-white bg-main-blue w-[160px] h-[45px] hover:bg-main-blue-hover">
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <FilterPostsContext.Provider value={{ cursor, posts, minPrice, maxPrice, sortBy, endpoint: `/api/users${location.pathname}` }}>
                {children}
            </FilterPostsContext.Provider>
        </div>
    )
}

export default FilterPostsProvider;
import SearchIcon from '../assets/search.png';
import Price from '../components/Price';
import { useRef, createContext, useState } from 'react';
import { MAX_PRICE } from '../views/CreatePost/Package';
import { usePaginatePosts } from '../hooks/usePaginatePosts';
import { IPost } from '../models/IPost';
import { sortPosts } from '../utils/sortPosts';
import { PaginatePosts } from '../types/PaginatePosts';
import { useLocation } from 'react-router-dom';
import SortBy from '../components/SortBy';
import CountriesDropdown from '../components/CountriesDropdown';
import CreatePost from '../views/CreatePost/CreatePost';
import AddIcon from '../assets/add.png';

interface FilterPostsContextProps {
    children?: React.ReactNode,
}

type filterPosts = {
    cursor: React.MutableRefObject<string | undefined>,
    posts: PaginatePosts<IPost> | undefined,
    endpoint: string,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>
}

export const FilterPostsContext = createContext<filterPosts | undefined>(undefined);

function FilterPostsProvider({ children }: FilterPostsContextProps) {
    const cursor = useRef<string | undefined>();
    const pageRef = useRef<HTMLDivElement>(null);
    const min = useRef<number>(0);
    const max = useRef<number>(MAX_PRICE);
    const sort = useRef<string>("most recent");
    const location = useLocation();
    const searchRef = useRef<HTMLInputElement>(null);
    const countryRef = useRef<HTMLSelectElement>(null);
    const [page, setPage] = useState<number>(1);
    const [postService, setPostService] = useState<boolean>(false);

    const search = searchRef.current?.value !== undefined ? searchRef.current.value : "";
    const sellerLocation = countryRef.current?.value && countryRef.current.value !== "Any" ? `&location=${countryRef.current.value}` : "";
    const url = `/api/users${location.pathname}?search=${search}&sort=${sortPosts[sort.current]}&min=${min.current}&max=${max.current}&page=${page}${sellerLocation}`;

    const posts = usePaginatePosts<IPost>(
        pageRef, 
        cursor,
        url,
        page,
        setPage
    );

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
                <div className="h-[calc(100vh-90px)] min-w-[350px] bg-main-white border-r border-light-border-gray p-7">
                    <button onClick={openPostService} className="btn-primary text-main-white bg-main-blue w-full px-5 h-[45px] 
                    hover:bg-main-blue-hover flex items-center justify-center gap-2 mb-[45px]">
                        <img src={AddIcon} alt="" className="w-[17px] h-[17px]" />
                        Create new post
                    </button>
                    <h2 className="text-[23px]">Details</h2>
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
                                    selected={"Any"}
                                    styles="max-w-[300px]"
                                    title="Seller location"
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
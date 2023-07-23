import SearchIcon from '../assets/search.png';
import Price from '../components/Price';
import { useRef, createContext, useState, useContext, useEffect, useCallback } from 'react';
import { MAX_PRICE, MAX_DELIVERY_DAYS } from '../views/CreatePost/Package';
import { usePaginateData } from '../hooks/usePaginateData';
import { IPost } from '../models/IPost';
import { sortPosts } from '../utils/sortPosts';
import { useLocation } from 'react-router-dom';
import SortBy from '../components/SortBy';
import CountriesDropdown from '../components/CountriesDropdown';
import CreatePost from '../views/CreatePost/CreatePost';
import AddIcon from '../assets/add.png';
import SearchLanguages from '../components/SearchLanguages';
import { deliveryTimes } from '../utils/deliveryTimes';
import { allSellerLevels } from '../utils/allSellerLevels';
import { UserContext } from './UserContext';
import { sellerLevelTextStyles } from '../utils/sellerLevelTextStyles';
import SellerExperience from '../components/SellerExperience';
import { FilterPosts } from '../types/FilterPosts';
import { AnimatePresence } from "framer-motion";
import ErrorPopUp from '../components/ErrorPopUp';
import { allExtraFilters } from '../utils/allExtraFilters';
import { useFetchJobCategories } from '../hooks/useFetchJobCategories';
import { getMatchedResults } from '../utils/getMatchedResults';
import { IWorkType } from '../models/IWorkType';
import MatchedResults from '../components/MatchedResults';
import Options from '../components/Options';
import { PaginationResponse } from '../types/PaginateResponse';

interface FilterPostsContextProps {
    children?: React.ReactNode,
    urlPrefix: string
}

interface SellerLevelsProps {
    loading: boolean,
    sellerLevels: string[],
    setSellerLevels: React.Dispatch<React.SetStateAction<string[]>>
}

interface DeliveryTimesProps {
    loading: boolean,
    searchHandler: () => void,
    deliveryTime: React.MutableRefObject<number>,
}

interface MainFiltersBarProps {
    searchRef: React.RefObject<HTMLInputElement>,
    min: number,
    max: number,
    setMin: React.Dispatch<React.SetStateAction<number>>,
    setMax: React.Dispatch<React.SetStateAction<number>>,
    country: string,
    setCountry: React.Dispatch<React.SetStateAction<string>>,
    sort: React.MutableRefObject<string>,
    loading: boolean,
    searchHandler: () => void
}

interface ExtraFiltersProps {
    loading: boolean,
    extraFilters: string[],
    setExtraFilters: React.Dispatch<React.SetStateAction<string[]>>
}

interface TypeOfWorkProps {
    selectedWork: string[],
    setSelectedWork: React.Dispatch<React.SetStateAction<string[]>>
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

function FilterPostsProvider({ children, urlPrefix }: FilterPostsContextProps) {
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
    }, [selectedLanguages, sellerLevels, extraFilters])

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
                    <button onClick={openPostService} className={`main-btn flex items-center justify-center gap-2 mb-[50.5px] 
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
                    <div className="overflow-y-scroll pr-[8px]" style={{ maxHeight: userContext.userData.seller ? 
                    "calc(100vh - 456px)" : "calc(100% - 148px)" }}>
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
                        <h3 className="text-side-text-gray mt-4 mb-2 text-[16px]">Seller speaks</h3>
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

function MainFiltersBar(props: MainFiltersBarProps) {
    return (
        <div className="h-[90px] max-w-[1430px] m-auto flex items-center px-[22.5px]">
            <div className="flex flex-grow items-center border-r border-light-border-gray h-full pr-6">
                <img src={SearchIcon} alt="" className="w-[17px] h-[17px] cursor-pointer"/>
                <input 
                    type="text" 
                    placeholder="Search for post" 
                    className="flex-grow focus:outline-none placeholder-side-text-gray ml-3" 
                    ref={props.searchRef}
                />
            </div>
            <div className="h-full border-r border-light-border-gray px-[12.75px] flex items-center gap-3 max-[1682px]:hidden">
                <Price 
                    value={props.min} 
                    maxValue={MAX_PRICE}
                    title="min price" 
                    setValue={props.setMin}
                />
                <div>-</div>
                <Price 
                    value={props.max} 
                    maxValue={MAX_PRICE}
                    title="max price" 
                    setValue={props.setMax}
                />
            </div>
            <div className="h-full border-r border-light-border-gray px-[12.75px] flex items-center max-[1308px]:hidden">
                <CountriesDropdown 
                    country={props.country}
                    setCountry={props.setCountry}
                    styles="w-[240px]"
                    title="Seller lives in"
                    anyLocation={true}
                />
            </div>
            <div className="h-full border-r border-light-border-gray pl-[12.75px] pr-[10px] flex items-center">
                <SortBy sortBy={props.sort} />
            </div>
            <div className="pl-[22.5px]">
                <button className={`btn-primary text-main-white bg-main-blue w-[160px] h-[48px] hover:bg-main-blue-hover
                ${props.loading ? "invalid-button" : ""}`}
                onClick={props.searchHandler}>
                    Search
                </button>
            </div>
        </div>
    )
}

function SellerLevels({ loading, setSellerLevels, sellerLevels }: SellerLevelsProps) {
    function updateSellerLevels(sellerLevel: string): void {
        setSellerLevels((cur) => {
            if (cur.includes(sellerLevel)) return cur.filter((level: string) => level !== sellerLevel);
            else return [...cur, sellerLevel];
        });
    }

    return (
        <div className="border-b border-light-border-gray pb-6 mt-4">
            <h3 className="text-side-text-gray mb-2 text-[16px]">Seller level</h3>
            <div className="flex flex-col gap-3">
                {allSellerLevels.map((sellerLevel: string, index: number) => {
                    return (
                        <div className="flex items-center gap-3" key={index}>
                            <input 
                                type="checkbox" 
                                name="seller-level" 
                                className={`w-[15px] h-[15px] mt-[1px] ${loading ? "invalid-button" : ""}`} 
                                id={sellerLevel}
                                defaultChecked={sellerLevels.includes(sellerLevel)}
                                onClick={() => updateSellerLevels(sellerLevel)}
                            />
                            <label htmlFor={sellerLevel} className="text-[15px] seller-level" style={sellerLevelTextStyles[sellerLevel]}>
                                {sellerLevel}
                            </label>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function DeliveryTimes({ loading, searchHandler, deliveryTime }: DeliveryTimesProps) {
    function updateDeliveryTime(newDeliveryTime: number): void {
        deliveryTime.current = newDeliveryTime;
        searchHandler();
    }

    return (
        <div className="border-b border-light-border-gray pb-5">
            <h3 className="text-side-text-gray mb-2 text-[16px]">Delivery time</h3>
            <div className="flex flex-col gap-2">
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
        </div>
    )
}

function TypeOfWork({ selectedWork, setSelectedWork }: TypeOfWorkProps) {
    const jobCategories = useFetchJobCategories();
    const [matchedWork, setMatchedWork] = useState<string[][]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    function searchHandler(value: string) {
        const allWork = [];

        for (let category of jobCategories.categories) {
            const workTypes = category.workTypes.map((workType: IWorkType) => workType.name);
            for (let workType of workTypes) {
                allWork.push(workType);
            }
        }

        const matched = getMatchedResults(allWork, value);
        setMatchedWork(matched);
        setSearchQuery(value);
    }

    function addWork(workType: string) {
        setSelectedWork((selected: string[]) => [
            ...selected.filter((cur: string) => cur !== workType), 
            workType
        ]);
    }

    function removeWork(workType: string) {
        setSelectedWork((selected: string[]) => selected.filter((cur: string) => cur !== workType));
    }

    return (
        <div className="border-b border-light-border-gray pb-6 mt-4">
            <h3 className="mb-2 text-side-text-gray">Type of freelance work</h3>
            <input 
                type="text" 
                className={`search-bar h-10 ${matchedWork.length > 0 ? "!rounded-b-none" : ""} focus:!outline-none`}
                placeholder="Search for work"
                onChange={(e) => searchHandler(e.target.value)}
                value={searchQuery}
            />
            {matchedWork.length > 0 &&
            <MatchedResults
                search={searchQuery}
                matchedResults={matchedWork}
                action={addWork}
            />}
            {selectedWork.length > 0 &&
            <Options 
                options={selectedWork} 
                removeOption={removeWork}
                styles="mt-4"
                bgColour="bg-very-light-pink"
                textColour="#bf01ff"
            />}
        </div>
    )
}

function ExtraFilters({ loading, extraFilters, setExtraFilters }: ExtraFiltersProps) {
    function toggleFilter(filter: string) {
        setExtraFilters((cur: string[]) => {
            if (cur.includes(filter)) return cur.filter((x) => x !== filter);
            else return [...cur, filter];
        });
    }

    return (
        <>
            <h3 className="text-side-text-gray mt-4 mb-2 text-[16px]">Extra</h3>
            <div className="flex flex-col gap-2">
                {allExtraFilters.map((filter: string, index: number) => {
                    return (
                        <div className="flex items-center gap-3" key={index}>
                            <input 
                                type="checkbox" 
                                name="seller-level" 
                                className={`w-[15px] h-[15px] mt-[1px] ${loading ? "invalid-button" : ""}`}
                                id={filter}
                                onChange={() => toggleFilter(filter)}
                                defaultChecked={extraFilters.includes(filter)}
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

export default FilterPostsProvider;
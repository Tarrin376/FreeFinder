import SearchIcon from "../assets/search.png";
import { useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import OutsideClickHandler from "react-outside-click-handler";
import { useNavigate } from "react-router-dom";
import Sellers from "./Sellers";
import Seller from "./Seller";
import { SellerData } from "../types/SellerData";
import { PaginationResponse } from "../types/PaginateResponse";
import SellerSkeleton from "../skeletons/SellerSkeleton";
import { AnimatePresence } from "framer-motion";
import { SellerOptions } from "../enums/SellerOptions";

const queryLimit = 6;

interface SearchSellersProps {
    styles?: string,
    toggleSidebar?: () => void
}

function SearchSellers({ styles, toggleSidebar }: SearchSellersProps) {
    const [sellers, setSellers] = useState<SellerData[]>([]);
    const [count, setCount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [allSellersPopUp, setAllSellersPopUp] = useState<boolean>(false);
    const [hide, setHide] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const searchRef = useRef<HTMLInputElement>(null);
    const searchQuery = searchRef.current?.value ?? "";
    const navigate = useNavigate();

    async function getMatchedSellers(query: string): Promise<SellerData[] | undefined> {
        try {
            setLoading(true);
            const response = await axios.post<PaginationResponse<SellerData>>(`/api/sellers?search=${query}`, { 
                limit: queryLimit 
            });
 
            setErrorMessage("");
            setCount(response.data.count);
            return response.data.next;
        }
        catch (err) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }

    async function searchHandler(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const query = e.target.value;
        const matchedSellers = await getMatchedSellers(query);

        if (matchedSellers !== undefined) {
            if (query === "") setSellers([]);
            else setSellers(matchedSellers);
        }
    }

    function navigateToProfile(username: string) {
        if (toggleSidebar) toggleSidebar();
        setHide(true);
        navigate(`/sellers/${username}`);
    }

    return (
        <>
            <AnimatePresence>
                {allSellersPopUp &&
                <Sellers 
                    search={searchQuery}
                    url={`/api/sellers?search=${searchQuery}`}
                    setSellersPopUp={setAllSellersPopUp}
                    option={SellerOptions.SAVE}
                />}
            </AnimatePresence>
            <OutsideClickHandler onOutsideClick={() => setHide(true)}>
                <div className={`relative w-[360px] ${styles}`}>
                    <div className={`flex items-center border border-light-border-gray 
                    rounded-[8px] ${searchQuery && !hide ? "rounded-b-none" : ""} px-3 h-10 bg-transparent w-full`}>
                        <img src={SearchIcon} alt="" className="w-5 h-5"/>
                        <input 
                            type="text" 
                            placeholder="Search for sellers" 
                            className="focus:outline-none placeholder-search-text bg-transparent ml-3 w-full"
                            onChange={searchHandler}
                            ref={searchRef}
                            onFocus={() => setHide(false)}
                        />
                    </div>
                    {searchQuery && !hide &&
                    <div className="border-b border-x border-light-border-gray rounded-b-[8px] 
                    bg-main-white absolute w-full z-20 p-2 overflow-hidden transition-all duration-200 ease-linear">
                        {errorMessage ? 
                        <p className="text-center text-side-text-gray">{errorMessage}</p> :
                        sellers.length === 0 && !loading &&
                        <p className="text-center text-side-text-gray">
                            No results found
                        </p>}
                        {!errorMessage &&
                        <div className="flex flex-col">
                            {(loading || sellers.length > 0) &&
                            <p className="ml-2 mt-2 mb-1 text-side-text-gray">
                                {`${loading ? "Loading results for" : `${count} ${count === 1 ? "result" : "results"} found for`} '${searchQuery}'`}
                            </p>}
                            {!loading ? sellers.map((seller: SellerData, index: number) => {
                                return (
                                    <Seller
                                        navigateToProfile={() => navigateToProfile(seller.user.username)}
                                        profilePicURL={seller.user.profilePicURL}
                                        status={seller.user.status}
                                        username={seller.user.username}
                                        searchQuery={searchQuery}
                                        sellerLevel={seller.sellerLevel.name}
                                        summary={seller.summary}
                                        country={seller.user.country}
                                        sellerID={seller.sellerID}
                                        statusStyles="before:left-[39px] before:top-[41px]"
                                        imgStyles="min-w-[57px] min-h-[57px]"
                                        key={index}
                                    />
                                )
                            }) : new Array(queryLimit).fill(0).map((_, index: number) => <SellerSkeleton key={index} />)}
                        </div>}
                        {sellers.length === queryLimit &&
                        <button className="m-auto block side-btn h-[35px] mt-[10px] mb-[10px]" 
                        onClick={() => {
                            setHide(true);
                            setAllSellersPopUp(true);
                        }}>
                            See more
                        </button>}
                    </div>}
                </div>
            </OutsideClickHandler>
        </>
    )
}

export default SearchSellers;
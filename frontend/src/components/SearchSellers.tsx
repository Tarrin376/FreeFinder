import SearchIcon from "../assets/search.png";
import { useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { sellerLevelTextStyles } from "../utils/sellerLevelTextStyles";
import OutsideClickHandler from "react-outside-click-handler";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import HighlightedSubstring from "./HighlightedSubstring";
import { useNavigate } from "react-router-dom";
import AllSellers from "./AllSellers";
import Seller from "./Seller";

const queryLimit = 6;

type SellerData = {
    user: {
        username: string,
        profilePicURL: string,
        country: string,
        status: string,
    },
    sellerLevel: {
        name: string
    },
    summary: string
}

function SearchSellers() {
    const [sellers, setSellers] = useState<SellerData[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [allSellersPopUp, setAllSellersPopUp] = useState<boolean>(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const [hide, setHide] = useState<boolean>(true);
    const searchQuery = searchRef.current?.value ?? "";
    const navigate = useNavigate();

    async function getMatchedSellers(query: string): Promise<SellerData[] | undefined> {
        try {
            const response = await axios.get<{ sellers: SellerData[], message: string }>(`/api/sellers?search=${query}&limit=${queryLimit}`);
            setErrorMessage("");
            return response.data.sellers;
        }
        catch (err) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
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
        setHide(true);
        navigate(`/sellers/${username}`);
    }

    return (
        <>
            {allSellersPopUp && 
                <AllSellers 
                search={searchQuery} 
                setAllSellersPopUp={setAllSellersPopUp} 
            />}
            <OutsideClickHandler onOutsideClick={() => setHide(true)}>
                <div className="relative">
                    <div className={`flex items-center border border-light-gray 
                    rounded-[8px] ${searchQuery && !hide ? "rounded-b-none" : ""} px-3 h-10 bg-transparent w-[400px]`}>
                        <img src={SearchIcon} alt="" className="w-5 h-5 cursor-pointer"/>
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
                    <div className="border-b border-x border-light-gray rounded-b-[8px] p-2 bg-main-white absolute w-full z-20">
                        {errorMessage ? 
                        <p className="text-center text-side-text-gray">{errorMessage}</p> :
                        sellers.length === 0 && 
                        <p className="text-center text-side-text-gray">
                            No results found
                        </p>}
                        {!errorMessage && sellers.length > 0 &&
                        <div className="flex flex-col">
                            <p className="ml-2 mt-2 mb-1 text-side-text-gray">
                                Search results for
                                <span>{` ${searchQuery}`}</span>
                            </p>
                            {sellers.map((seller: SellerData) => {
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
                                    />
                                )
                            })}
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
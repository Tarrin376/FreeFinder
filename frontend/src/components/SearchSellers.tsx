import SearchIcon from "../assets/search.png";
import { useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { sellerLevelTextStyles } from "../utils/sellerLevelTextStyles";
import OutsideClickHandler from "react-outside-click-handler";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import HighlightedSubstring from "./HighlightedSubstring";
import { useNavigate } from "react-router-dom";

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
    const searchRef = useRef<HTMLInputElement>(null);
    const [hide, setHide] = useState<boolean>(true);
    const searchQuery = searchRef.current?.value ? searchRef.current.value : "";
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
        navigate(`/sellers/${username}`);
    }

    return (
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
                                <div className="flex items-center gap-3 cursor-pointer hover:bg-[#f7f7f7] p-2 rounded-[6px]
                                transition-all ease-out duration-100" onClick={() => navigateToProfile(seller.user.username)}>
                                    <div className="relative">
                                        <ProfilePicAndStatus
                                            profilePicURL={seller.user.profilePicURL}
                                            profileStatus={seller.user.status}
                                            statusStyles="before:left-[35px] before:top-[37px]"
                                            imgStyles="w-[53px] h-[53px]"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <HighlightedSubstring
                                                word={seller.user.username}
                                                substring={searchQuery}
                                                foundAt={seller.user.username.toLowerCase().indexOf(searchQuery.toLowerCase())}
                                                styles="hover:!px-0"
                                            />
                                            <p className="text-[14px] seller-level"
                                            style={sellerLevelTextStyles[seller.sellerLevel.name]}>
                                                {seller.sellerLevel.name}
                                            </p>
                                        </div>
                                        <p className="text-[14px] text-side-text-gray 
                                        whitespace-nowrap text-ellipsis overflow-hidden w-[300px] mt-[2px]">
                                            {seller.summary}
                                        </p>
                                        <p className="text-[14px] text-side-text-gray">
                                            {seller.user.country}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>}
                    {sellers.length === queryLimit &&
                    <button className="m-auto block side-btn h-[35px] mt-[10px] mb-[10px]">
                        See more
                    </button>}
                </div>}
            </div>
        </OutsideClickHandler>
    )
}

export default SearchSellers;
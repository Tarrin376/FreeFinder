import SearchIcon from "../assets/search.png";
import { useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { sellerLevelTextStyles } from "../utils/sellerLevelTextStyles";
import OutsideClickHandler from "react-outside-click-handler";
import ProfilePicAndStatus from "./ProfilePicAndStatus";

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
        const search = e.target.value;
        const matchedSellers = await getMatchedSellers(search);

        if (matchedSellers !== undefined) {
            if (search === "") setSellers([]);
            else setSellers(matchedSellers);
        }
    }

    console.log(sellers);

    return (
        <div className="relative">
            <OutsideClickHandler onOutsideClick={() => setHide(true)}>
                <div className={`flex items-center border border-light-gray 
                rounded-[8px] ${searchRef.current?.value && !hide ? "rounded-b-none" : ""} px-3 h-10 bg-transparent w-[400px]`}>
                    <img src={SearchIcon} alt="" className="w-5 h-5 cursor-pointer"/>
                    <input 
                        type="text" 
                        placeholder="Search for sellers" 
                        className="focus:outline-none placeholder-search-text bg-transparent ml-3"
                        onChange={searchHandler}
                        ref={searchRef}
                        onFocus={() => setHide(false)}
                    />
                </div>
            </OutsideClickHandler>
            {searchRef.current?.value && !hide &&
            <div className="border-b border-x border-light-gray rounded-b-[8px] p-2 bg-main-white absolute w-full">
                {errorMessage ? 
                <p className="text-center text-side-text-gray">{errorMessage}</p> :
                sellers.length === 0 ? 
                <p className="text-center text-side-text-gray">
                    No results found for
                    <span>{` ${searchRef.current?.value}`}</span>
                </p> :
                <div className="flex flex-col gap-1">
                    {sellers.map((seller: SellerData) => {
                        return (
                            <div className="flex items-center gap-3 cursor-pointer hover:bg-[#f7f7f7] p-2 rounded-[6px]
                            transition-all ease-out duration-100">
                                <div className="relative">
                                    <ProfilePicAndStatus
                                        profilePicURL={seller.user.profilePicURL}
                                        profileStatus={seller.user.status}
                                        statusStyles="before:left-[30px]"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[15px]">{seller.user.username}</p>
                                        <p className="text-[14px] seller-level"
                                        style={sellerLevelTextStyles[seller.sellerLevel.name]}>
                                            {seller.sellerLevel.name}
                                        </p>
                                    </div>
                                    <p className="text-[14px] text-side-text-gray mt-[2px] 
                                    whitespace-nowrap text-ellipsis overflow-hidden w-[300px]">
                                        {seller.summary}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>}
            </div>}
        </div>
    )
}

export default SearchSellers;
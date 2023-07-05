import SearchIcon from "../assets/search.png";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";

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
    }
}

function SearchSellers() {
    const [sellers, setSellers] = useState<SellerData[]>([]);
    const [query, setQuery] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

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
        setQuery(search);

        const matchedSellers = await getMatchedSellers(search);
        if (matchedSellers !== undefined) {
            setSellers(matchedSellers);
        }
    }

    return (
        <div className="relative">
            <div className={`flex items-center border border-light-gray 
            rounded-[8px] ${query !== "" ? "rounded-b-none" : ""} px-3 h-10 bg-transparent w-[400px]`}>
                <img src={SearchIcon} alt="" className="w-5 h-5 cursor-pointer"/>
                <input 
                    type="text" 
                    placeholder="Search for sellers" 
                    className="focus:outline-none placeholder-search-text bg-transparent ml-3"
                    value={query}
                    onChange={searchHandler}
                />
            </div>
            {query !== "" &&
            <div className="border-b border-x border-light-gray rounded-b-[8px] p-4 bg-main-white absolute w-full">
                {errorMessage ? <p className="m-auto">{errorMessage}</p> : 
                <p>yo</p>}
            </div>}
        </div>
    )
}

export default SearchSellers;
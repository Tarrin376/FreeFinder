import PopUpWrapper from "../wrappers/PopUpWrapper";
import { usePaginateData } from "../hooks/usePaginateData";
import { SellerData } from "../types/SellerData";
import { useRef, useState } from "react";
import Seller from "./Seller";
import { useNavigate } from "react-router-dom";
import SellerSkeleton from "../skeletons/SellerSkeleton";
import { limit } from "../hooks/usePaginateData";
import PaginationScrollInfo from "./PaginationScrollInfo";
import { SellerOptions } from "../enums/SellerOptions";

interface SellersProps {
    search: string,
    url: string,
    setSellersPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    savedSellers?: boolean,
    option?: SellerOptions
}

function Sellers({ search, url, setSellersPopUp, savedSellers, option }: SellersProps) {
    const pageRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const cursor = useRef<string>();
    const navigate = useNavigate();

    const sellers = usePaginateData<{}, SellerData>(pageRef, cursor, url, page, setPage, {});

    function navigateToProfile(username: string) {
        setSellersPopUp(false);
        navigate(`/sellers/${username}`);
    }

    function getTitle() {
        if (savedSellers) return `Your saved sellers (${sellers.count})`;
        else return `${sellers.loading ? "Loading results" : `${sellers.count}
        ${sellers.count === 1 ? " result" : " results"}`} found for '${search}'`
    }

    return (
        <PopUpWrapper title={getTitle()} setIsOpen={setSellersPopUp} width={600}>
            <div ref={pageRef} className="w-full overflow-y-scroll pr-[5px] max-h-[500px]">
                {sellers.data.map((seller: SellerData, index: number) => {
                    return (
                        <Seller
                            navigateToProfile={() => navigateToProfile(seller.user.username)}
                            profilePicURL={seller.user.profilePicURL}
                            status={seller.user.status}
                            username={seller.user.username}
                            searchQuery={search}
                            sellerLevel={seller.sellerLevel.name}
                            summary={seller.summary}
                            country={seller.user.country}
                            sellerID={seller.sellerID}
                            statusStyles="before:left-[42px] before:top-[45px]"
                            imgStyles="min-w-[62px] min-h-[62px]"
                            key={index}
                            option={option}
                        />
                    )
                })}
                {sellers.loading && 
                new Array(limit).fill(0).map((_, index: number) => {
                    return (
                        <SellerSkeleton 
                            imgStyles="w-[62px] h-[62px]"
                            key={index}
                        />
                    )
                })}
                <PaginationScrollInfo 
                    data={sellers} 
                    page={page.value}
                    styles="mt-2 mb-2"
                />
            </div>
        </PopUpWrapper>
    )
}

export default Sellers;
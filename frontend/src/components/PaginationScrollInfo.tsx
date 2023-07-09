import { PaginateData } from "../types/PaginateData";
import { IPost } from "../models/IPost";
import { MOD } from "../hooks/usePaginationScroll";
import { SellerData } from "../types/SellerData";

interface PostScrollInfoProps {
    data: PaginateData<IPost | SellerData>,
    page: number,
    styles?: string
}

function PaginationScrollInfo({ data, page, styles }: PostScrollInfoProps) {
    return (
        <div className={`${styles} w-full`}>
            {!data.loading && page % MOD === 0 && !data.reachedBottom &&
            <button className="m-auto block side-btn w-fit" onClick={data.goToNextPage}>
                Show more results
            </button>}
            {!data.loading && data.reachedBottom && data.data.length > 0 &&
            <p className="text-center text-side-text-gray">
                You've reached the end of the list.
            </p>}
        </div>
    )
}

export default PaginationScrollInfo;
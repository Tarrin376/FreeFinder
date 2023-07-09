
interface SellerSkeletonProps {
    imgStyles?: string
}

function SellerSkeleton({ imgStyles }: SellerSkeletonProps) {
    return (
        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-[6px]">
            <div className={`w-[57px] h-[57px] loading rounded-full ${imgStyles}`}></div>
            <div className="flex-grow">
                <div className="h-[13px] loading w-[92%]">
                </div>
                <div className="h-[13px] loading w-[100%] mt-2">
                </div>
                <div className="h-[13px] loading w-[83%] mt-2">
                </div>
            </div>
        </div>
    )
}

export default SellerSkeleton;
import Star from "./Star";

function CreateReview() {
    return (
        <div className="w-full mt-[58px] rounded-[12px] shadow-pop-up p-6 bg-main-blue sticky top-[58px]">
            <h1 className="text-[23px] text-main-white mb-2">Rate this service</h1>
            <h2 className="text-main-white">Service as described</h2>
            <div className="flex items-center gap-2 mt-2 mb-3">
                {new Array(5).fill(0).map((_, index: number) => {
                    return <Star key={index} size={20} />
                })}
            </div>
            <h2 className="text-main-white">Seller communication</h2>
            <div className="flex items-center gap-2 mt-2 mb-3">
                {new Array(5).fill(0).map((_, index: number) => {
                    return <Star key={index} size={20} />
                })}
            </div>
            <h2 className="text-main-white">Service delivery</h2>
            <div className="flex items-center gap-2 mt-2 mb-5">
                {new Array(5).fill(0).map((_, index: number) => {
                    return <Star key={index} size={20} />
                })}
            </div>
            <h2 className="text-main-white">Write a review on this service</h2>
            <textarea 
                className="search-bar bg-transparent text-main-white mt-2 
                rounded-[8px] placeholder:text-[#fcfcfcec]" 
                rows={5} 
                placeholder="Summarize your experience with this seller"
            />
            <button className="side-btn h-[48px] w-full mt-6">Submit review</button>
        </div>
    )
}

export default CreateReview;
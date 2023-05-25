
function TopReviews() {
    return (
        <div className="mt-4 flex gap-5">
            {new Array(2).fill(0).map((_) => {
                return (
                    <div className="w-[50%] bg-main-white rounded-[8px] flex items-center gap-5 py-4 px-5 shadow-info-component">
                        <div className="min-w-[60px] min-h-[60px] rounded-full bg-black"></div>
                        <div className="">
                            <p className="text-main-blue">Jason Fried <span className="text-side-text-gray ml-2 text-sm">Nov 10, 2020</span></p>
                            <p className="text-paragraph-text">
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam ratione incidunt qui architecto repellendus saepe excepturi quidem tempora cum ea?
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default TopReviews;
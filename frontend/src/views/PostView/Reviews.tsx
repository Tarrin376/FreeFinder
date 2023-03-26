
function Review() {
    return (
        <div className="w-[50%] bg-main-white rounded-[8px] flex items-center gap-4 p-4 shadow-post">
            <div className="min-w-[60px] min-h-[60px] rounded-full bg-black"></div>
            <div className="">
                <p className="text-main-blue">Jason Fried <span className="text-side-text-gray ml-2">Nov 10, 2020</span></p>
                <p className="text-paragraph-text">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam ratione incidunt qui architecto repellendus saepe excepturi quidem tempora cum ea?
                </p>
            </div>
        </div>
    )
}

export default Review;
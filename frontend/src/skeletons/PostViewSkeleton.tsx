function PostViewSkeleton() {
    return (
        <div className="flex gap-[80px]">
            <div className="w-3/4">
                <header>
                    <div className="loading w-[200px] h-[20px] mb-3"></div>
                    <div className="text-3xl mb-4 w-[100%] h-[30px] loading"></div>
                    <div className="flex gap-3 items-center">
                        <div className="w-[50px] h-[50px] loading rounded-full"></div>
                        <div>
                            <div className="flex items-center gap-[7px]">
                                <div className="w-[70px] h-[15px] loading"></div>
                                <p className="w-[20px] h-[15px] loading"></p>
                            </div>
                            <div className="w-[97px] h-[15px] loading mt-2"></div>
                        </div>
                    </div>
                    <div className="flex w-full gap-8 mt-8 h-[550px]">
                        <div className="w-4/6 block loading"></div>
                        <div className="w-2/6 flex-1 loading"></div>
                    </div>
                </header>
                <div className="loading w-[350px] h-[28px] mb-6 mt-10"></div>
                <div className="loading w-[100%] h-[20px] mb-3"></div>
                <div className="loading w-[90%] h-[20px] mb-3"></div>
                <div className="loading w-[95%] h-[20px] mb-3"></div>
                <div className="loading w-[80%] h-[20px] mb-3"></div>
            </div>
            <div className="w-1/4 flex flex-col gap-7 loading h-[calc(100vh-210px)]"></div>
        </div>
    );
}

export default PostViewSkeleton;
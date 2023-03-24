function PostPageSkeleton() {
    return (
        <div className="page flex gap-[60px]">
            <div className="w-[70%]">
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
                    <div className="flex w-[100%] h-[480px] gap-4 mt-8">
                        <div className="w-[750px] block loading"></div>
                        <div className="flex-1 loading"></div>
                    </div>
                </header>
                <div className="flex justify-between mt-8 items-center">
                    <div className="loading w-[350px] h-[28px]"></div>
                    <div className="w-[105px] h-[25px] loading"></div>
                </div>
                <div className="mt-5 flex gap-5 h-[95px]">
                    <div className="w-[50%] loading"></div>
                    <div className="w-[50%] loading"></div>
                </div>
                <div className="loading w-[350px] h-[28px] mb-5 mt-8"></div>
                <div className="loading w-[100%] h-[20px] mb-3"></div>
                <div className="loading w-[90%] h-[20px] mb-3"></div>
                <div className="loading w-[95%] h-[20px] mb-3"></div>
                <div className="loading w-[80%] h-[20px] mb-3"></div>
            </div>
            <div className="w-[25%] flex flex-col gap-7 loading"></div>
        </div>
    );
}

export default PostPageSkeleton;
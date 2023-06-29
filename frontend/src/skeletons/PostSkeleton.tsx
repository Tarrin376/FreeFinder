function PostSkeleton() {
    return (
        <div className="bg-main-white border-light-border-gray w-[290px] rounded-[8px] relative overflow-hidden shadow-post">
            <div className="w-full h-[210px] loading rounded-t-[8px] rounded-b-none"></div>
            <div className="py-3 px-3">
                <div className="flex items-center mb-2 gap-3 relative">
                    <div className="w-12 h-12 loading rounded-full" />
                    <div className="flex-grow">
                        <div className="justify-between flex">
                            <div className="w-[130px] h-[13px] loading mb-2"></div>
                            <div className="w-[25px] h-[13px] loading mb-2"></div>
                        </div>
                        <div className="w-[90px] h-[13px] loading"></div>
                    </div>
                </div>
                <div className="w-[110px] h-[14px] loading mt-3"></div>
                <div className="w-[100%] h-[16px] loading mb-2 mt-4"></div>
                <div className="w-[80%] h-[16px] loading mb-4"></div>
                <div className="flex items-center justify-between border-t border-t-light-gray pt-5 pb-2">
                    <div className="w-[55%] h-[17px] loading"></div>
                </div>
            </div>
        </div>
    );
}

export default PostSkeleton;
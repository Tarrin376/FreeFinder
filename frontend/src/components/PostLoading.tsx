
function PostLoading() {
    return (
        <div className="bg-main-white w-[290px] rounded-[8px] border border-light-gray shadow-post overflow-hidden">
            <div className="w-full h-[200px] loading"></div>
            <div className="p-4">
                <div className="flex items-center mt-1 mb-2 gap-3">
                    <div className="w-12 h-12 loading rounded-full" />
                    <div>
                        <div className="w-[50px] h-[15px] loading rounded-[12px] mb-2"></div>
                        <div className="w-[90px] h-[15px] loading rounded-[12px]"></div>
                    </div>
                </div>
                <div className="w-[120px] h-[15px] loading rounded-[12px] mt-3"></div>
                <div className="w-[100%] h-[17px] loading rounded-[12px] mb-2 mt-5"></div>
                <div className="w-[80%] h-[17px] loading rounded-[12px] mb-5"></div>
                <div className="mt-4 flex items-center justify-between border-t border-t-light-gray pt-4">
                    <div className="w-[55%] h-[22px] loading rounded-[12px]"></div>
                    <div className="w-[22px] h-[22px] loading rounded-full"></div>
                </div>
            </div>
        </div>
    );
}

export default PostLoading;
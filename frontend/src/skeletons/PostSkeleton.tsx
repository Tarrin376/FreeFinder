function PostSkeleton() {
    return (
        <div className="bg-transparent w-[290px] rounded-[8px] relative overflow-hidden">
            <div className="w-full h-[250px] loading rounded-[11px]"></div>
            <div className="py-2">
                <div className="flex items-center mt-1 mb-2 gap-3 relative">
                    <div className="w-12 h-12 loading rounded-full" />
                    <div>
                        <div className="w-[50px] h-[15px] loading mb-2"></div>
                        <div className="w-[90px] h-[15px] loading"></div>
                    </div>
                </div>
                <div className="w-[130px] h-[15px] loading mt-3"></div>
                <div className="w-[100%] h-[17px] loading mb-2 mt-4"></div>
                <div className="w-[80%] h-[17px] loading mb-4"></div>
                <div className="mt-4 flex items-center justify-between border-t border-t-light-gray pt-4">
                    <div className="w-[55%] h-[20px] loading"></div>
                </div>
            </div>
        </div>
    );
}

export default PostSkeleton;
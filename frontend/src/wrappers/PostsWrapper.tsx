function PostsWrapper({ children }: { children?: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-7 items-center pb-11">
            <div className="flex gap-[22px] items-start flex-wrap w-full">
                {children}
            </div>
        </div>
    );
}

export default PostsWrapper;
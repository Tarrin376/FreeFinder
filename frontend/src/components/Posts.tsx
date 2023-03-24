function Posts({ children }: { children?: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-7 items-center pb-11">
            <div className="flex gap-[30px] items-start flex-wrap pb-11 w-full">
                {children}
            </div>
        </div>
    );
}

export default Posts;
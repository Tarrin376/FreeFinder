
interface PostWrapperProps {
    children?: React.ReactNode,
}

function PostsWrapper({ children }: PostWrapperProps) {
    return (
        <div className="flex gap-[23px] items-start flex-wrap w-full">
            {children}
        </div>
    );
}

export default PostsWrapper;
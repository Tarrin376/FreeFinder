interface PostWrapperProps {
    children?: React.ReactNode,
}

function PostsWrapper({ children }: PostWrapperProps) {
    return (
        <div className="grid w-full gap-7" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))" }}>
            {children}
        </div>
    );
}

export default PostsWrapper;
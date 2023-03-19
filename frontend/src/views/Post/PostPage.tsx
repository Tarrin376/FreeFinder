import { useLocation } from "react-router-dom";

function PostPage() {
    const location = useLocation();
    console.log(location);
    return (
        <div>
            yo
        </div>
    );
}

export default PostPage;
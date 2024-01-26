import Posts from "../../components/Post/Posts";
import { IPost } from "src/models/IPost";

interface BrowseAllViewProps {
    posts?: IPost[] | undefined,
    loading?: boolean,
    count?: React.MutableRefObject<number>,
}

function BrowseAllView({ posts, loading, count }: BrowseAllViewProps) {
    return (
        <Posts 
            noResultsFoundTitle="Sorry, we could not find any posts." 
            posts={posts}
            loading={loading ?? true}
            count={count}
        />
    )
}

export default BrowseAllView;
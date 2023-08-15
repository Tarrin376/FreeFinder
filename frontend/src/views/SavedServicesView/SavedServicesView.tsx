import { useState, useContext, memo } from 'react';
import Posts from '../../components/Posts';
import { FilterPostsContext } from '../../providers/FilterPostsProvider';
import { IPost } from 'src/models/IPost';

interface SavedServicesViewProps {
    posts?: IPost[] | undefined,
    loading?: boolean,
    count?: React.MutableRefObject<number>,
}

function SavedServicesView({ posts, loading, count }: SavedServicesViewProps) {
    const [deletingPost, setDeletingPost] = useState<boolean>(false);
    const filterContext = useContext(FilterPostsContext);

    return (
        <Posts
            noResultsFoundTitle="Sorry, we could not find any of your saved services."
            posts={posts}
            loading={loading ?? true}
            count={count}
            canRemove={{
                deletingPost: deletingPost,
                setDeletingPost: setDeletingPost,
                removeURL: filterContext?.endpoint ?? "",
                unsave: true
            }}
            title="Your saved services"
        />
    )
}

export default memo(SavedServicesView);
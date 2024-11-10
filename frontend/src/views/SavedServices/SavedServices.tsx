import { useState, useContext, memo } from 'react';
import Posts from '../../components/Post/Posts';
import { FilterPostsContext } from '../../providers/FilterPostsProvider';
import { IPost } from '../../models/IPost';

interface SavedServicesProps {
    posts?: IPost[] | undefined,
    loading?: boolean,
    count?: React.MutableRefObject<number>,
}

function SavedServices({ posts, loading, count }: SavedServicesProps) {
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

export default memo(SavedServices);
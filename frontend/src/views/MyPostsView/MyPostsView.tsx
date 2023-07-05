import { useState } from 'react';
import Posts from '../../components/Posts';

function MyPostsView() {
    const [deletingPost, setDeletingPost] = useState<boolean>(false);

    return (
        <Posts
            canRemove={{
                deletingPost: deletingPost,
                setDeletingPost: setDeletingPost,
                removeURL: `/api/posts`
            }}
            noResultsFoundTitle="Sorry, we could not find any of your posts."
        />
    )
}

export default MyPostsView;
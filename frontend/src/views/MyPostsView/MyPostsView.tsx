import { useState, memo } from 'react';
import Posts from '../../components/Post/Posts';
import { IPost } from 'src/models/IPost';

interface MyPostsViewProps {
    posts?: IPost[] | undefined,
    loading?: boolean,
    count?: React.MutableRefObject<number>,
}

function MyPostsView({ posts, loading, count }: MyPostsViewProps) {
    const [deletingPost, setDeletingPost] = useState<boolean>(false);
  
    return (
        <Posts
            noResultsFoundTitle="Sorry, we could not find any of your services."
            posts={posts}
            loading={loading ?? true}
            count={count}
            canRemove={{
                deletingPost: deletingPost,
                setDeletingPost: setDeletingPost,
                removeURL: `/api/posts`
            }}
            title="Your services"
        />
    )
}

export default memo(MyPostsView);
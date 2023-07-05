import { useState, useContext } from 'react';
import Posts from '../../components/Posts';
import { FilterPostsContext } from '../../providers/FilterPostsProvider';

function SavedServicesView() {
    const [deletingPost, setDeletingPost] = useState<boolean>(false);
    const filterContext = useContext(FilterPostsContext);

    return (
        <Posts
            canRemove={{
                deletingPost: deletingPost,
                setDeletingPost: setDeletingPost,
                removeURL: filterContext?.endpoint ? filterContext.endpoint : "",
                unsave: true
            }}
            noResultsFoundTitle="Sorry, we could not find any of your saved posts."
        />
    )
}

export default SavedServicesView;
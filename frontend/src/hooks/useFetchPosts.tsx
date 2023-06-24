import { useEffect, useState } from 'react';
import { fetchPosts } from '../utils/fetchPosts';
import { IPost } from '../models/IPost';
import { useScrollEvent } from './useScrollEvent';

export function useFetchPosts(pageRef: React.RefObject<HTMLDivElement>, sellerUserID: string, username: string, url: string, 
    nextPage: boolean, setNextPage: React.Dispatch<React.SetStateAction<boolean>>, cursor: React.MutableRefObject<any>) {

    const [reachedBottom, setReachedBottom] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [posts, setPosts] = useState<IPost[]>([]);

    useScrollEvent(username, pageRef, loading, reachedBottom, setNextPage);

    useEffect(() => {
        try {
            setLoading(true);
            setTimeout(() => {
                (async (): Promise<void> => {
                    const posts = await fetchPosts(url, sellerUserID, setPosts, cursor.current);
                    if (posts.last) setReachedBottom(true);
                    else cursor.current = posts.cursor;
                    setErrorMessage("");
                    setLoading(false);
                })();
            }, 1000);
        }
        catch(err: any) {
            setErrorMessage(err.message);
            setLoading(false);
        }
    }, [nextPage, url, cursor, sellerUserID]);

    return { 
        posts, 
        errorMessage, 
        loading, 
        setReachedBottom, 
        setNextPage,
        setPosts
    };
}
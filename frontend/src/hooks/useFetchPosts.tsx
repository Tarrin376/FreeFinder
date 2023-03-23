import { useEffect, useState } from 'react';
import { fetchPosts } from '../utils/fetchPosts';
import { IPost } from '../models/IPost';
import { useScrollEvent } from './useScrollEvent';

export function useFetchPosts(pageRef: React.RefObject<HTMLDivElement>, sellerUserID: string, username: string, URL: string, 
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
                fetchPosts(URL, sellerUserID, setPosts, cursor.current)
                .then((res) => {
                    if (res.last) setReachedBottom(true);
                    else cursor.current = res.cursor;
                    setErrorMessage("");
                    setLoading(false);
                }).catch((err: any) => { 
                    setErrorMessage(err.message);
                    setLoading(false);
                });
            }, 1000);
        }
        catch(err: any) {
            setErrorMessage(err.message);
        }
    }, [nextPage, URL, cursor, sellerUserID]);

    return { 
        posts, 
        errorMessage, 
        loading, 
        setReachedBottom, 
        setNextPage,
        setPosts, 
    };
}
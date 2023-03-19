import { useEffect, useState } from 'react';
import { IUserContext } from '../context/UserContext';
import { fetchPosts } from '../utils/fetchPosts';
import { IPost } from '../models/IPost';
import { useScrollEvent } from './useScrollEvent';

export function useFetchPosts(pageRef: React.RefObject<HTMLDivElement>, userContext: IUserContext, url: string, nextPage: boolean,
    setNextPage: React.Dispatch<React.SetStateAction<boolean>>, cursor: React.MutableRefObject<string>) {
    const [reachedBottom, setReachedBottom] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [posts, setPosts] = useState<IPost[]>([]);

    useScrollEvent(userContext, pageRef, loading, reachedBottom, setNextPage);

    useEffect(() => {
        try {
            setLoading(true);
            setTimeout(() => {
                fetchPosts(`${url}/${cursor.current}`, setPosts)
                .then((next) => {
                    if (next === cursor.current) setReachedBottom(true);
                    else cursor.current = next;
                    setErrorMessage("");
                    setLoading(false);
                }).catch((err: any) => { 
                    setErrorMessage(err.message);
                    setLoading(false);
                });
            }, 2000);
        }
        catch(err: any) {
            setErrorMessage(err.message);
        }
    }, [nextPage, url, cursor]);

    return { 
        posts, 
        errorMessage, 
        loading, 
        setReachedBottom, 
        setNextPage,
        setPosts, 
    };
}
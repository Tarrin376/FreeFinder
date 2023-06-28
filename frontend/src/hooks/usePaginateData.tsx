import { useEffect, useState } from 'react';
import { useScrollEvent } from './useScrollEvent';
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from '../utils/getAPIErrorMessage';
import { PaginateData } from '../types/PaginateData';

export function usePaginateData<T>(pageRef: React.RefObject<HTMLDivElement>, url: string, cursor: React.MutableRefObject<string>): PaginateData<T> {
    const [reachedBottom, setReachedBottom] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [posts, setPosts] = useState<T[]>([]);
    const [nextPage, setNextPage] = useState<boolean>(false);

    useScrollEvent(pageRef, loading, reachedBottom, setNextPage);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            (async (): Promise<void> => {
                try {
                    const resp = await axios.post<{ posts: T[], cursor: string, last: boolean }>(url, { cursor: cursor.current });
                    setPosts((state) => [...state, ...resp.data.posts]);
    
                    if (resp.data.last) {
                        setReachedBottom(true);
                    } else {
                        cursor.current = resp.data.cursor;
                    }
    
                    setErrorMessage("");
                    setLoading(false);
                }
                catch(err: any) {
                    const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>)
                    setErrorMessage(errorMessage);
                    setLoading(false);
                }
            })();
        }, 1000);
    }, [nextPage, url, cursor]);

    return { 
        posts, 
        errorMessage, 
        loading, 
        setReachedBottom, 
        setNextPage,
        setPosts
    };
}
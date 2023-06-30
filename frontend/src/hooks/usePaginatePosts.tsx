import { useEffect, useState, useRef } from 'react';
import { useScrollEvent } from './useScrollEvent';
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from '../utils/getAPIErrorMessage';
import { PaginatePosts } from '../types/PaginatePosts';

export function usePaginatePosts<T>(
    pageRef: React.RefObject<HTMLDivElement>, 
    cursor: React.MutableRefObject<string | undefined>,
    url: string,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>)
: PaginatePosts<T> {

    const reachedBottom = useRef<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [allPosts, setAllPosts] = useState<T[]>([]);

    function resetState(): void {
        cursor.current = undefined;
        reachedBottom.current = false;
        setAllPosts([]);
        setPage(1);
    }

    function goToNextPage(): void {
        setPage((cur) => cur + 1);
    }

    useScrollEvent(pageRef, loading, reachedBottom.current, goToNextPage, page);

    useEffect(() => {
        if (loading) {
            return;
        }
        
        setLoading(true);
        (async (): Promise<void> => {
            try {
                const resp = await axios.get<{ posts: T[], cursor: string, last: boolean }>(url + (cursor.current ? `&cursor=${cursor.current}` : ``));
                setAllPosts((state) => [...state, ...resp.data.posts]);
                cursor.current = resp.data.cursor;

                if (resp.data.last) {
                    reachedBottom.current = true;
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
    }, [url, cursor]);

    return { 
        allPosts, 
        errorMessage, 
        loading,
        reachedBottom: reachedBottom.current,
        resetState,
        goToNextPage,
    };
}
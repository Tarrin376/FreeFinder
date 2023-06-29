import { useEffect, useState, useRef } from 'react';
import { useScrollEvent } from './useScrollEvent';
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from '../utils/getAPIErrorMessage';
import { PaginateData } from '../types/PaginateData';

export function usePaginatePosts<T>(
    pageRef: React.RefObject<HTMLDivElement>, 
    cursor: React.MutableRefObject<string>,
    url: string,
    nextPage: { pageNumber: number },
    setNextPage: React.Dispatch<React.SetStateAction<{ pageNumber: number }>>)
: PaginateData<T> {

    const reachedBottom = useRef<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [allPosts, setAllPosts] = useState<T[]>([]);

    function resetState() {
        cursor.current = "HEAD";
        reachedBottom.current = false;
        setAllPosts([]);
        setNextPage({ pageNumber: 1 });
    }

    function goToNextPage() {
        setNextPage((cur) => {
            return { pageNumber: cur.pageNumber + 1 };
        })
    }

    useScrollEvent(pageRef, loading, reachedBottom.current, goToNextPage, nextPage.pageNumber);

    useEffect(() => {
        console.log(url);
        setLoading(true);
        (async (): Promise<void> => {
            try {
                const resp = await axios.get<{ posts: T[], cursor: string, last: boolean }>(`${url}&cursor=${cursor.current}`);
                setAllPosts((state) => [...state, ...resp.data.posts]);

                if (resp.data.last) {
                    reachedBottom.current = true;
                } else {
                    cursor.current = resp.data.cursor;
                }

                setErrorMessage("");
            }
            catch(err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>)
                setErrorMessage(errorMessage);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [url, nextPage, cursor]);

    return { 
        allPosts, 
        errorMessage, 
        loading,
        nextPage,
        reachedBottom: reachedBottom.current,
        resetState,
        goToNextPage,
    };
}
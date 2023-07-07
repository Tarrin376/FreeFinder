import { useEffect, useState, useRef } from 'react';
import { useScrollEvent } from './useScrollEvent';
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from '../utils/getAPIErrorMessage';
import { PaginatePosts } from '../types/PaginatePosts';

export function usePaginatePosts<T>(
    pageRef: React.RefObject<HTMLDivElement>, 
    cursor: React.MutableRefObject<string | undefined>,
    url: string,
    page: { value: number },
    setPage: React.Dispatch<React.SetStateAction<{ value: number }>>,
    data: {
        search: string | undefined,
        sort: string,
        min: number,
        max: number,
        location: string | undefined,
        languages: string[],
        deliveryTime: number,
        sellerLevels: string[]
    })
: PaginatePosts<T> {
    const reachedBottom = useRef<boolean>(false);
    const count = useRef<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [allPosts, setAllPosts] = useState<T[]>([]);

    function resetState(): void {
        cursor.current = undefined;
        reachedBottom.current = false;
        setAllPosts([]);
        setPage({ value: 1 });
    }

    function goToNextPage(): void {
        setPage((cur) => {
            return { value: cur.value + 1 };
        });
    }

    useScrollEvent(pageRef, loading, reachedBottom.current, goToNextPage, page.value);

    useEffect(() => {
        if (loading) {
            return;
        }
        
        setLoading(true);
        (async (): Promise<void> => {
            try {
                const resp = await axios.post<{ posts: T[], cursor: string, last: boolean, count: number }>(url, {
                    ...data,
                    cursor: cursor.current
                });

                setAllPosts((state) => [...state, ...resp.data.posts]);
                cursor.current = resp.data.cursor;

                if (resp.data.last) {
                    reachedBottom.current = true;
                }

                if (resp.data.count !== 0) {
                    count.current = resp.data.count;
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
    }, [page, url, cursor]);

    return { 
        allPosts, 
        errorMessage, 
        loading,
        reachedBottom: reachedBottom.current,
        count: count.current,
        resetState,
        goToNextPage,
    };
}
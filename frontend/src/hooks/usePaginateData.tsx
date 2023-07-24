import { useEffect, useState, useRef } from 'react';
import { usePaginationScroll } from './usePaginationScroll';
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from '../utils/getAPIErrorMessage';
import { PaginateData } from '../types/PaginateData';
import { PaginationResponse } from '../types/PaginateResponse';

type PaginationProperties = "next" | "cursor" | "last" | "count" | "message";
export const limit = 20;

export function usePaginateData<T1, T2, T3 extends PaginationResponse<T2>>(
    pageRef: React.RefObject<HTMLDivElement>, curCursor: React.MutableRefObject<string | undefined>, url: string, 
    page: { value: number }, setPage: React.Dispatch<React.SetStateAction<{ value: number }>>, args: T1)
: PaginateData<T2> & {
    meta: Omit<T3, PaginationProperties> | undefined
} {
    const reachedBottom = useRef<boolean>(false);
    const total = useRef<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [data, setData] = useState<T2[]>([]);
    const [meta, setMeta] = useState<Omit<T3, PaginationProperties>>();

    function resetState(): void {
        curCursor.current = undefined;
        reachedBottom.current = false;
        setData([]);
        setMeta(undefined);
        setPage({ value: 1 });
    }

    function goToNextPage(): void {
        setPage((cur) => {
            return { value: cur.value + 1 };
        });
    }

    usePaginationScroll(pageRef, loading, reachedBottom.current, goToNextPage, page.value);

    useEffect(() => {
        if (loading) {
            return;
        }

        setLoading(true);
        (async (): Promise<void> => {
            try {
                const resp = await axios.post<T3>(url, {
                    ...args,
                    cursor: curCursor.current,
                    limit: limit
                });

                const { next, cursor, last, count, message, ...metaData } = resp.data;
                if (Object.keys(metaData).length > 0) {
                    setMeta(metaData);
                }

                setData((state) => [...state, ...resp.data.next]);
                curCursor.current = resp.data.cursor;
                setErrorMessage("");

                if (resp.data.last) {
                    reachedBottom.current = true;
                }

                if (data.length === 0) {
                    total.current = resp.data.count;
                }
            }
            catch(err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>)
                setErrorMessage(errorMessage);
            }
            finally {
                setLoading(false);
            }
        })();
    }, [page, curCursor]);

    return { 
        data, 
        meta,
        errorMessage, 
        loading,
        reachedBottom: reachedBottom.current,
        count: total,
        resetState,
        setErrorMessage,
        goToNextPage
    };
}
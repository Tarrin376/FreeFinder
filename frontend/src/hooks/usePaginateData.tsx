import { useEffect, useState, useRef } from 'react';
import { usePaginationScroll } from './usePaginationScroll';
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from '../utils/getAPIErrorMessage';
import { PaginateData } from '../types/PaginateData';
import { PaginationResponse } from '../types/PaginateResponse';

export const limit = 20;

export function usePaginateData<T1, T2, T3 extends PaginationResponse<T2>>(pageRef: React.RefObject<HTMLDivElement>, 
    cursor: React.MutableRefObject<string | undefined>, url: string, 
    page: { value: number }, setPage: React.Dispatch<React.SetStateAction<{ value: number }>>,
    args: T1)
: PaginateData<T2> {

    const reachedBottom = useRef<boolean>(false);
    const count = useRef<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [data, setData] = useState<T2[]>([]);

    function resetState(): void {
        cursor.current = undefined;
        reachedBottom.current = false;
        setData([]);
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
                    cursor: cursor.current,
                    limit: limit
                });

                console.log(resp);

                setData((state) => [...state, ...resp.data.next]);
                cursor.current = resp.data.cursor;

                if (resp.data.last) {
                    reachedBottom.current = true;
                }

                if (data.length === 0) {
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
        data, 
        errorMessage, 
        loading,
        reachedBottom: reachedBottom.current,
        count: count,
        resetState,
        setErrorMessage,
        goToNextPage
    };
}
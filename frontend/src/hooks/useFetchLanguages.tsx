import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Languages } from '../types/Languages';
import { getAPIErrorMessage } from '../utils/getAPIErrorMessage';
import { getUniqueArray } from '../utils/getUniqueArray';

export function useFetchLanguages(): {
    languages: string[],
    errorMessage: string
} {
    const [languages, setLanguages] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const resp = await axios.get<Languages[]>(`https://restcountries.com/v3.1/all`);
                const allLanguages: string[][] = resp.data.map((cur: Languages) => {
                    if (cur.languages) return Object.keys(cur.languages).map((key: string) => cur.languages[key].toLowerCase());
                    else return [];
                });

                const res = allLanguages.reduce((acc: string[], cur: string[]) => [...acc, ...cur], []);
                const filteredLanguages = getUniqueArray(res, (cur => cur));
                filteredLanguages.sort();
                setLanguages(filteredLanguages);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                setErrorMessage(errorMessage);
            }
        })();
    }, []);

    return {
        languages,
        errorMessage
    }
}
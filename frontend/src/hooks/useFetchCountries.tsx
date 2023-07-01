import { useEffect, useState } from 'react';
import { Country } from '../types/Country';
import axios, { AxiosError } from 'axios';
import { getAPIErrorMessage } from '../utils/getAPIErrorMessage';

export function useFetchCountries(): {
    countries: Country[],
    errorMessage: string
} {
    const [countries, setCountries] = useState<Country[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const resp = await axios.get<Country[]>(`https://restcountries.com/v3.1/all`);
                const countries = resp.data.map((cur: Country) => {
                    return {
                        flag: cur.flag,
                        name: {
                            common: cur.name.common
                        }
                    };
                });

                if (countries) {
                    countries.sort((a, b) => a.name.common > b.name.common ? 1 : -1);
                    setCountries(countries);
                }
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                setErrorMessage(errorMessage);
            }
        })();
    }, []);

    return {
        countries,
        errorMessage
    };
}
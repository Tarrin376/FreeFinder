import { useEffect, useState } from 'react';
import { Country } from '../types/Country';

export function useFetchCountries(): Country[] {
    const [countries, setCountries] = useState<Country[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const data: Promise<Country[]> = fetch('https://restcountries.com/v3.1/all')
        .then((resp) => resp.json())
        .then((data) => data.map((cur: Country) => {
            return {
                flag: cur.flag,
                name: {
                    common: cur.name.common
                }
            };
        }))
        .catch((err: any) => {
            setErrorMessage(err.message);
        });

        data.then((countries) => {
            if (countries) {
                countries.sort((a, b) => a.name.common > b.name.common ? 1 : -1);
                setCountries(countries);
            }
        });
    }, []);

    return countries;
}
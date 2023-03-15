import { useEffect, useState } from 'react';

export type Country = {
    flag: string,
    name: {
        common: string
    }
}

export function useFetchCountries(): Country[] {
    const [countries, setCountries] = useState<Country[]>([]);

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
        }));

        data.then((resp) => {
            resp.sort((a, b) => a.name.common > b.name.common ? 1 : -1);
            setCountries(resp);
        });
    }, []);

    return countries;
}
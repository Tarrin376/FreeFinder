import { useEffect, useState } from 'react';
import { Country } from '../types/Country';

export function useFetchCountries(): Country[] {
    const [countries, setCountries] = useState<Country[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const response = await fetch("https://restcountries.com/v3.1/all");
                if (response.status === 500) {
                    setErrorMessage(`Looks like we are having trouble on our end. Please try again later. 
                    (Error code: ${response.status})`);
                    return;
                }
                
                const data: Country[] = await response.json();
                const countries = data.map((cur: Country) => {
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
                setErrorMessage(err.message);
            }
        })();
    }, []);

    return countries;
}
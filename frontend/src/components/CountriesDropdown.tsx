import { useFetchCountries } from "../hooks/useFetchCountries";
import { Country } from '../types/Country';

interface CountriesDropdownProps {
    countryRef: React.RefObject<HTMLSelectElement>, 
    selected: string
}

function CountriesDropdown({ countryRef, selected }: CountriesDropdownProps) {
    const allCountries = useFetchCountries();

    return (
        <div className="search-bar py-2">
            <p className="text-[12px] text-search-text h-fit tracking-wide select-none">Country</p>
            <select className={`w-full cursor-pointer mt-1 rounded-[8px] ${allCountries.countries.length > 0 ? 
            'bg-main-white' : 'loading'}`} ref={countryRef}>
                {allCountries.countries.map((country: Country) => {
                    return (
                        <option key={country.name.common} selected={selected === `${country.flag} ${country.name.common}`}>
                            {country.flag} {country.name.common}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

export default CountriesDropdown;
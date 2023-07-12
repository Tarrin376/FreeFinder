import { useFetchCountries } from "../hooks/useFetchCountries";
import { Country } from '../types/Country';

interface CountriesDropdownProps {
    countryRef: React.RefObject<HTMLSelectElement>, 
    selected: string,
    styles?: string,
    title: string,
    anyLocation?: boolean
}

function CountriesDropdown({ countryRef, selected, styles, title, anyLocation }: CountriesDropdownProps) {
    const allCountries = useFetchCountries();

    return (
        <div className={`search-bar py-2 ${styles}`}>
            <p className="text-[13px] text-side-text-gray h-fit tracking-wide select-none">{title}</p>
            <select className={`w-full cursor-pointer mt-1 rounded-[8px] focus:outline-none 
            ${allCountries.countries.length > 0 ? 'bg-main-white' : 'loading'}`} ref={countryRef}>
                {anyLocation && allCountries.countries.length > 0 && 
                <option>
                    Any country
                </option>}
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
import { useFetchCountries } from "../hooks/useFetchCountries";
import { Country } from '../types/Country';

interface CountriesDropdownProps {
    country: string,
    updateCountry: (country: string) => void,
    styles?: string,
    title: string,
    anyLocation?: boolean
}

function CountriesDropdown({ country, updateCountry, styles, title, anyLocation }: CountriesDropdownProps) {
    const allCountries = useFetchCountries();

    return (
        <div className={`search-bar py-2 ${styles}`}>
            <p className="text-sm text-side-text-gray h-fit tracking-wide select-none">
                {title}
            </p>
            <select className={`w-full cursor-pointer rounded-[8px] focus:outline-none 
            ${allCountries.countries.length > 0 ? 'bg-main-white' : 'loading'}`} value={country}
            onChange={(e) => updateCountry(e.target.value)}>
                {anyLocation && allCountries.countries.length > 0 && 
                <option>
                    Any country
                </option>}
                {allCountries.countries.map((country: Country) => {
                    return (
                        <option key={country.name.common}>
                            {country.flag} {country.name.common}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

export default CountriesDropdown;
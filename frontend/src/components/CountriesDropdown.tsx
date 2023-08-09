import { useFetchCountries } from "../hooks/useFetchCountries";
import { Country } from '../types/Country';
import FilterBoxWrapper from "src/wrappers/FilterBoxWrapper";

interface CountriesDropdownProps {
    country: string,
    updateCountry: (country: string) => void,
    text: string,
    anyLocation?: boolean
}

function CountriesDropdown({ country, updateCountry, text, anyLocation }: CountriesDropdownProps) {
    const allCountries = useFetchCountries();

    return (
        <FilterBoxWrapper text={text}>
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
        </FilterBoxWrapper>
    );
}

export default CountriesDropdown;
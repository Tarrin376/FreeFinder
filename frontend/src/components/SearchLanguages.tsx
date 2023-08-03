import { useState } from "react";
import { useFetchLanguages } from "../hooks/useFetchLanguages";
import Options from "./Options";
import { getMatchedResults } from "../utils/getMatchedResults";
import MatchedResults from "./MatchedResults";

interface SearchLanguagesProps {
    loading?: boolean,
    selectedLanguages: string[],
    setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>,
    searchBarStyles?: string,
    styles?: string,
}

function SearchLanguages({ loading, selectedLanguages, setSelectedLanguages, searchBarStyles, styles }: SearchLanguagesProps) {
    const [language, setLanguage] = useState<string>("");
    const [matchedLanguages, setMatchedLanguages] = useState<string[][]>([]);
    const allLanguages = useFetchLanguages();

    function searchHandler(e: React.ChangeEvent<HTMLInputElement>): void {
        const search = e.target.value;
        const matched = getMatchedResults(allLanguages.languages, search);
        setMatchedLanguages(matched);
        setLanguage(search);
    }

    function addLanguage(language: string): void {
        if (!loading) {
            setSelectedLanguages((selected: string[]) => [
                ...selected.filter((curLang: string) => curLang !== language), 
                language
            ]);
        }
    }

    function removeLanguage(language: string): void {
        if (!loading) {
            setSelectedLanguages((selected: string[]) => selected.filter((curLang: string) => curLang !== language));
        }
    }

    return (
        <div className={styles}>
            <input 
                type="text" 
                className={`search-bar ${matchedLanguages.length > 0 ? "!rounded-b-none" : ""} ${searchBarStyles} focus:!outline-none`}
                placeholder="Search for a language" 
                value={language}
                onChange={searchHandler}
                disabled={loading}
            />
            {matchedLanguages.length > 0 &&
            <MatchedResults
                search={language}
                matchedResults={matchedLanguages}
                action={addLanguage}
            />}
            {selectedLanguages.length > 0 &&
            <Options 
                options={selectedLanguages} 
                removeOption={removeLanguage}
                wrapperStyles="mt-4"
                styles="bg-highlight"
                textColour="#4E73F8"
            />}
        </div>
    )
}

export default SearchLanguages;
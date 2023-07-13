import { useState } from "react";
import { useFetchLanguages } from "../hooks/useFetchLanguages";
import Options from "./Options";
import HighlightedSubstring from "./HighlightedSubstring";

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

    function getMatchedLanguages(search: string): string[][] {
        if (search === "") {
            return [];
        }

        const res = allLanguages.languages.map((language: string) => {
            const index = language.indexOf(search.toLowerCase());
            if (index !== -1) return [language, index.toString()];
            else return [];
        });

        return res.filter((cur: string[]) => cur.length > 0);
    }

    function searchHandler(e: React.ChangeEvent<HTMLInputElement>): void {
        const search = e.target.value;
        const matched = getMatchedLanguages(search);
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
            <div className="border-b border-x border-light-border-gray rounded-b-[8px] max-h-[300px] overflow-y-scroll p-4 bg-main-white">
                <div className="flex flex-col gap-1">
                    {matchedLanguages.map((cur: string[], index: number) => {
                        return (
                            <HighlightedSubstring
                                action={addLanguage}
                                word={cur[0]}
                                substring={language}
                                foundAt={parseInt(cur[1])}
                                key={index}
                            />
                        )
                    })}
                </div>
            </div>}
            {selectedLanguages.length > 0 &&
            <Options 
                options={selectedLanguages} 
                removeOption={removeLanguage}
                styles="mt-4"
                bgColour="bg-highlight"
                textColour="#4E73F8"
            />}
        </div>
    )
}

export default SearchLanguages;
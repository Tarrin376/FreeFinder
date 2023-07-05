import { useState } from "react";
import { useFetchLanguages } from "../hooks/useFetchLanguages";
import Options from "./Options";
import HighlightedSubstring from "./HighlightedSubstring";

interface SearchLanguagesProps {
    setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>,
    selectedLanguages: string[],
    searchBarStyles?: string,
    styles?: string,
    applyChanges?: {
        callback: () => void,
        disabled: boolean
    }
}

function SearchLanguages({ setSelectedLanguages, selectedLanguages, searchBarStyles, styles, applyChanges }: SearchLanguagesProps) {
    const [language, setLanguage] = useState<string>("");
    const [matchedLanguages, setMatchedLanguages] = useState<string[][]>([]);
    const allLanguages = useFetchLanguages();
    const [applyChangesBtn, setApplyChangesBtn] = useState<boolean>(false);

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
        setApplyChangesBtn(true);
        setSelectedLanguages((selected: string[]) => [
            ...selected.filter((curLang: string) => curLang !== language), 
            language
        ]);
    }

    function removeLanguage(language: string): void {
        setApplyChangesBtn(true);
        setSelectedLanguages((selected: string[]) => selected.filter((curLang: string) => curLang !== language));
    }

    function applyAll() {
        if (!applyChanges) {
            return;
        }

        applyChanges.callback();
        setApplyChangesBtn(false);
    }

    return (
        <div className={styles}>
            <input 
                type="text" 
                className={`search-bar ${matchedLanguages.length > 0 ? "!rounded-b-none" : ""} ${searchBarStyles} focus:!outline-none`}
                placeholder="Search for a language" 
                value={language}
                onChange={searchHandler}
            />
            {matchedLanguages.length > 0 &&
            <div className="border-b border-x border-light-gray rounded-b-[8px] max-h-[300px] overflow-y-scroll p-4 bg-main-white">
                <div className="flex flex-col gap-1">
                    {matchedLanguages.map((cur: string[]) => {
                        const index = parseInt(cur[1]);
                        return (
                            <HighlightedSubstring
                                action={addLanguage}
                                word={cur[0]}
                                substring={language}
                                foundAt={index}
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
            />}
            {applyChanges && applyChangesBtn &&
            <button className={`main-btn w-fit px-3 !h-9 !text-[14px] mt-4 ${applyChanges.disabled ? "invalid-button" : ""}`} 
            onClick={applyAll}>
                Apply changes
            </button>}
        </div>
    )
}

export default SearchLanguages;
import { useFetchJobCategories } from "../hooks/useFetchJobCategories";
import { useState } from "react";
import { getMatchedResults } from "../utils/getMatchedResults";
import MatchedResults from "./MatchedResults";
import Options from "./Options";

interface TypeOfWorkProps {
    selectedWork: string[],
    updateSelectedWork: (selectedWork: string[]) => void
}

function TypeOfWork({ selectedWork, updateSelectedWork }: TypeOfWorkProps) {
    const jobCategories = useFetchJobCategories();
    const [matchedWork, setMatchedWork] = useState<string[][]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    function searchHandler(value: string) {
        const allWork = [];

        for (let category of jobCategories.categories) {
            const workTypes = category.workTypes.map(workType => workType.name);
            for (let workType of workTypes) {
                allWork.push(workType);
            }
        }

        const matched = getMatchedResults(allWork, value);
        setMatchedWork(matched);
        setSearchQuery(value);
    }

    function addWork(workType: string) {
        updateSelectedWork([
            ...selectedWork.filter((cur: string) => cur !== workType), 
            workType
        ]);
    }

    function removeWork(workType: string) {
        updateSelectedWork(selectedWork.filter((cur: string) => cur !== workType));
    }

    return (
        <div className="border-b border-light-border-gray pb-5 mt-5">
            <h3 className="mb-2 text-side-text-gray">Type of freelance work</h3>
            <input 
                type="text" 
                className={`search-bar h-10 ${matchedWork.length > 0 ? "!rounded-b-none" : ""} focus:!outline-none`}
                placeholder="Search for work"
                onChange={(e) => searchHandler(e.target.value)}
                value={searchQuery}
            />
            {matchedWork.length > 0 &&
            <MatchedResults
                search={searchQuery}
                matchedResults={matchedWork}
                action={addWork}
            />}
            {selectedWork.length > 0 &&
            <Options 
                options={selectedWork} 
                removeOption={removeWork}
                wrapperStyles="mt-4"
                styles="bg-very-light-pink"
                textColour="#bf01ff"
            />}
        </div>
    )
}

export default TypeOfWork;
import HighlightedSubstring from "./HighlightedSubstring";

interface MatchedResultsProps {
    search: string,
    matchedResults: string[][],
    action: (value: string) => void
}

function MatchedResults({ search, matchedResults, action }: MatchedResultsProps) {
    return (
        <div className="border-b border-x border-light-border-gray rounded-b-[8px] max-h-[300px] overflow-y-scroll p-4 bg-main-white">
            <div className="flex flex-col gap-1">
                {matchedResults.map((cur: string[], index: number) => {
                    return (
                        <HighlightedSubstring
                            action={action}
                            word={cur[0]}
                            substring={search}
                            foundAt={parseInt(cur[1])}
                            key={index}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default MatchedResults;

interface HighlightedSubstringProps {
    styles?: string,
    action: (word: string) => void,
    word: string,
    substring: string,
    foundAt: number,
}

function HighlightedSubstring({ styles, action, word, substring, foundAt }: HighlightedSubstringProps) {
    const chars = word.split('');

    return (
        <p className={`cursor-pointer transition-all ease-linear duration-100 hover:px-2 ${styles}`}
        onClick={() => action(word)} key={word}>
            {chars.map((char: string, curIndex: number) => {
                return (
                    <span className={`font-bold ${curIndex >= foundAt && curIndex < foundAt + substring.length ?
                    " bg-highlight" : ""}`}
                    key={curIndex}>
                        {char}
                    </span>
                )
            })}
        </p>
    )
}

export default HighlightedSubstring;
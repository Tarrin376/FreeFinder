interface HighlightedSubstringProps {
    styles?: string,
    action?: (word: string) => void,
    word: string,
    substring: string,
    foundAt: number,
}

function HighlightedSubstring({ styles, action, word, substring, foundAt }: HighlightedSubstringProps) {
    const defaultStyles = `cursor-pointer transition-all ease-linear duration-100 [&>span]:hover:text-main-blue`;
    const chars = word.split('');

    function clickHandler(): void {
        if (action) {
            action(word)
        }
    }

    return (
        <p className={`${defaultStyles} ${styles}`} onClick={clickHandler} title={word}>
            {chars.map((char: string, curIndex: number) => {
                return (
                    <span className={`text-[15px] transition-all ease-out duration-200 ${curIndex >= foundAt && 
                    curIndex < foundAt + substring.length ? " bg-highlight" : ""}`} key={curIndex}>
                        {char}
                    </span>
                )
            })}
        </p>
    )
}

export default HighlightedSubstring;
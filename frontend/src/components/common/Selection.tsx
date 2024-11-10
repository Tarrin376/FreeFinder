import { AccountSections } from "src/enums/AccountSections";

interface SelectionProps<T extends AccountSections> {
    currentOption: T,
    option: T,
    updateOption: (option: T) => void,
    text: string
}

function Selection<T extends AccountSections>({ currentOption, option, updateOption, text }: SelectionProps<T>) {
    const defaultStyles = `cursor-pointer pb-3 flex-shrink-0`;

    return (
        <li className={`${defaultStyles} ${currentOption === option ? "border-b-[3px] border-b-main-black" : ""}`}
        onClick={() => updateOption(option)}>
            {text}
        </li>
    )
}

export default Selection;
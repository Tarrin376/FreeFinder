import { AccountSections } from "src/enums/AccountSections"

interface SettingsSelectionProps {
    currentOption: AccountSections,
    option: AccountSections,
    updateOption: (option: AccountSections) => void,
    text: string
}

function SettingsSelection({ currentOption, option, updateOption, text }: SettingsSelectionProps) {
    const defaultStyles = `cursor-pointer pb-4 flex-shrink-0`;

    return (
        <li className={`${defaultStyles} ${currentOption === option ? "border-b-[3px] border-b-main-black" : ""}`}
        onClick={() => updateOption(option)}>
            {text}
        </li>
    )
}

export default SettingsSelection;
import { DropdownItem } from "src/types/DropdownItem";
import SidePopUpWrapper from "src/wrappers/SidePopUpWrapper";
import DropdownElement from "./DropdownElement";

interface DropdownProps {
    toggleDropdown: () => void,
    items: Array<DropdownItem>,
    textStyles?: string,
    styles?: string
}

function Dropdown({ toggleDropdown, items, textStyles, styles }: DropdownProps) {
    const defaultStyles = `absolute bg-main-white top-[30px] right-0 flex flex-col rounded-[6px] border 
    border-light-border-gray shadow-profile-page-container overflow-hidden min-w-[120px] pt-[6px] w-fit`;

    return (
        <SidePopUpWrapper setIsOpen={toggleDropdown}>
            <div className={`${defaultStyles} ${styles}`}>
                {items.map((item, index) => {
                    return (
                        <DropdownElement
                            action={item![1]}
                            text={item![0]}
                            styles={textStyles}
                            key={index}
                        />
                    )
                })}
            </div>
        </SidePopUpWrapper>
    )
}

export default Dropdown;
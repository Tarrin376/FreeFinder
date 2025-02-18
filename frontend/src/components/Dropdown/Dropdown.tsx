import SidePopUpWrapper from "../../wrappers/SidePopUpWrapper";

interface DropdownProps {
    toggleDropdown: () => void,
    styles?: string,
    children?: React.ReactNode
}

function Dropdown({ toggleDropdown, styles, children }: DropdownProps) {
    const defaultStyles = `absolute bg-main-white top-[30px] right-0 flex flex-col rounded-[6px] border border-light-border-gray 
    shadow-profile-page-container overflow-hidden min-w-[120px] pt-[6px] w-fit z-20`;

    return (
        <SidePopUpWrapper setIsOpen={toggleDropdown}>
            <div className={`${defaultStyles} ${styles}`}>
                {children}
            </div>
        </SidePopUpWrapper>
    )
}

export default Dropdown;
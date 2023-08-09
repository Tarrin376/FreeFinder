import { useState } from "react";
import DropdownIcon from "../assets/dropdown.png";
import OutsideClickHandler from "react-outside-click-handler";
import { NavElement } from "../types/NavElement";
import DropdownElement from "./DropdownElement";

interface NavDropdownProps {
    title: string,
    items: Array<[string, (e?: React.MouseEvent<NavElement>) => void]>,
    styles?: string
}

function NavDropdown({ title, items, styles }: NavDropdownProps) {
    const [dropdown, setDropdown] = useState<boolean>(false);
    const defaultStyles = `cursor-pointer relative z-20`;

    function toggleDropdown(): void {
        setDropdown((cur) => !cur);
    }

    return (
        <div className={`${defaultStyles} ${styles}`} onClick={toggleDropdown}>
            <div className="flex items-center gap-2">
                <span>{title}</span>
                <img 
                    src={DropdownIcon} 
                    className={`w-[15px] h-[15px] transition-all duration-200 
                    ease-linear ${dropdown ? "rotate-180" : ""}`} 
                    alt="" 
                />
            </div>
            {dropdown &&
            <OutsideClickHandler onOutsideClick={toggleDropdown}>
                <div className="absolute bg-main-white top-[30px] right-0 flex flex-col rounded-[6px] 
                border border-light-border-gray shadow-profile-page-container overflow-hidden min-w-[120px]">
                    {items.map((item, index) => {
                        return (
                            <DropdownElement
                                action={item[1]}
                                text={item[0]}
                                key={index}
                            />
                        )
                    })}
                </div>
            </OutsideClickHandler>}
        </div>
    )
}

export default NavDropdown;
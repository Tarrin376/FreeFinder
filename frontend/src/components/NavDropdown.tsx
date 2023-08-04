import { useState } from "react";
import DropdownIcon from "../assets/dropdown.png";
import OutsideClickHandler from "react-outside-click-handler";
import NavDropdownItem from "./NavDropdownItem";
import { NavElement } from "../types/NavElement";

interface NavDropdownProps {
    title: string,
    items: Array<[string, (e?: React.MouseEvent<NavElement>) => void]>
}

function NavDropdown({ title, items }: NavDropdownProps) {
    const [dropdown, setDropdown] = useState<boolean>(false);

    function toggleDropdown(): void {
        setDropdown((cur) => !cur);
    }

    return (
        <li className="cursor-pointer relative" onClick={toggleDropdown}>
            <div className="flex items-center gap-3">
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
                border border-light-border-gray shadow-profile-page-container overflow-hidden min-w-[120px] z-30">
                    {items.map((item, index) => {
                        return (
                            <NavDropdownItem
                                action={item[1]}
                                text={item[0]}
                                key={index}
                            />
                        )
                    })}
                </div>
            </OutsideClickHandler>}
        </li>
    )
}

export default NavDropdown;
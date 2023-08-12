import { useState, useRef } from "react";
import DropdownIcon from "../assets/dropdown.png";
import { AnimatePresence } from "framer-motion";
import { DropdownItem } from "src/types/DropdownItem";
import Dropdown from "./Dropdown";

interface NavDropdownProps {
    title: string,
    items: Array<DropdownItem>,
    textSize: number,
    textStyles?: string,
    styles?: string
}

function NavDropdown({ title, items, textSize, textStyles, styles }: NavDropdownProps) {
    const [dropdown, setDropdown] = useState<boolean>(false);
    const defaultStyles = `cursor-pointer relative z-20`;
    const filteredItems = useRef<Array<DropdownItem>>(items.filter((item) => item !== undefined));

    function toggleDropdown(): void {
        setDropdown((cur) => !cur);
    }

    return (
        <div className={`${defaultStyles} ${styles}`} onClick={toggleDropdown}>
            <div className="flex items-center gap-2">
                <span className={textStyles} style={{ fontSize: `${textSize}px` }}>
                    {title}
                </span>
                <img 
                    src={DropdownIcon} 
                    className={`transition-all duration-200 ease-linear ${dropdown ? "rotate-180" : ""}`}
                    style={{ width: `${textSize}px`, height: `${textSize}px` }}
                    alt="" 
                />
            </div>
            <AnimatePresence>
                {dropdown &&
                <Dropdown
                    toggleDropdown={toggleDropdown}
                    items={filteredItems.current}
                />}
            </AnimatePresence>
        </div>
    )
}

export default NavDropdown;
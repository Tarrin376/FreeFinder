import { useState } from "react";
import DropdownIcon from "../assets/dropdown.png";
import { AnimatePresence } from "framer-motion";
import Dropdown from "./Dropdown";

interface NavDropdownProps {
    title: string,
    textSize: number,
    textStyles?: string,
    styles?: string,
    children?: React.ReactNode
}

function NavDropdown({ title, textSize, textStyles, styles, children }: NavDropdownProps) {
    const [dropdown, setDropdown] = useState<boolean>(false);
    const defaultStyles = `cursor-pointer relative z-20`;

    function toggleDropdown(): void {
        setDropdown((cur) => !cur);
    }

    return (
        <div className={`${defaultStyles} ${styles}`}>
            <div className="flex items-center gap-2" onClick={toggleDropdown}>
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
                <Dropdown toggleDropdown={toggleDropdown}>
                    {children}
                </Dropdown>}
            </AnimatePresence>
        </div>
    )
}

export default NavDropdown;
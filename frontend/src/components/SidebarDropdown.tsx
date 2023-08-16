import { useState } from "react";
import DropdownIcon from "../assets/dropdown.png";

interface SidebarDropdownProps {
    children: React.ReactNode,
    title: string,
    styles?: string
}

function SidebarDropdown({ children, title, styles }: SidebarDropdownProps) {
    const [dropdown, setDropdown] = useState<boolean>(false);

    return (
        <div className={`${dropdown ? "pb-6" : "pb-9"}`}>
            <div className={`sidebar-item flex items-center justify-between ${styles}`} onClick={() => setDropdown((cur) => !cur)}>
                <span>{title}</span>
                <img 
                    src={DropdownIcon} 
                    className={`w-[15px] h-[15px] transition-all duration-200 
                    ease-linear ${dropdown ? "rotate-180" : ""}`}
                    alt="" 
                />
            </div>
            {dropdown &&
            <div className="mt-3">
                {children}
            </div>}
        </div>
    )
}

export default SidebarDropdown;
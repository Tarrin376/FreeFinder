import { NavElement } from "../types/NavElement"

interface NavDropdownItemProps {
    action: (e?: React.MouseEvent<NavElement>) => void,
    text: string
}

function NavDropdownItem({ action, text }: NavDropdownItemProps) {
    return (
        <p className="cursor-pointer hover:bg-main-white-hover profile-menu-element py-[6px] link" 
        onClick={action}>
            {text}
        </p>
    )
}

export default NavDropdownItem;
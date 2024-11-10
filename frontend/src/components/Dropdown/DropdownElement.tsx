import { NavElement } from "../../types/NavElement";

interface DropdownElementProps {
    text: string,
    action?: (e?: React.MouseEvent<NavElement>) => void,
    styles?: string
}

function DropdownElement({ action, text, styles }: DropdownElementProps) {
    const defaultStyles = `link text-main-black whitespace-nowrap px-3 pb-[6px] text-left text-[15px]`;

    return (
        <p className={`${defaultStyles} ${styles}`} onClick={action}>
            {text}
        </p>
    )
}

export default DropdownElement;
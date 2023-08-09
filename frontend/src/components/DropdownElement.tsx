import { NavElement } from "src/types/NavElement";

interface DropdownElementProps {
    action?: (e?: React.MouseEvent<NavElement>) => void,
    text: string,
    styles?: string
}

function DropdownElement({ action, text, styles }: DropdownElementProps) {
    const defaultStyles = `link text-main-black whitespace-nowrap px-3 py-1 text-left text-[15px]`;

    return (
        <p className={`${defaultStyles} ${styles}`} onClick={action}>
            {text}
        </p>
    )
}

export default DropdownElement;
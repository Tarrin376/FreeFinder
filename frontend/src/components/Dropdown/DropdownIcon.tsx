import DropdownIcon from "../../assets/dropdown.png";

interface DropdownIconElementProps {
    size: number,
    dropdown: boolean,
    action?: () => void,
    styles?: string
}

function DropdownIconElement({ size, dropdown, action, styles }: DropdownIconElementProps) {
    function handleClick(): void {
        if (action) {
            action();
        }
    }

    return (
        <img 
            src={DropdownIcon} 
            className={`transition-all duration-200 ease-linear cursor-pointer ${dropdown ? "rotate-180" : ""} ${styles}`}
            onClick={handleClick}
            style={{ width: `${size}px`, height: `${size}px` }}
            alt="" 
        />
    )
}

export default DropdownIconElement;
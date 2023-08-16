import HamburgerMenuItem from "./HamburgerMenuItem"

interface HamburgerMenuProps {
    size: number,
    action: () => void
}

function HamburgerMenu({ size, action }: HamburgerMenuProps) {
    return (
        <div className="flex flex-col gap-[7px] justify-between cursor-pointer"
        style={{ width: `${size}px`, height: `${size}px` }} onClick={action}>
            <HamburgerMenuItem height={2} />
            <HamburgerMenuItem height={2} />
            <HamburgerMenuItem height={2} />
        </div>
    )
}

export default HamburgerMenu;
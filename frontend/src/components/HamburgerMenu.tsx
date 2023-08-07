interface HamburgerMenuProps {
    size: number,
    action: () => void
}

function HamburgerMenu({ size, action }: HamburgerMenuProps) {
    return (
        <div className="flex flex-col gap-[7px] justify-between cursor-pointer"
        style={{ width: `${size}px`, height: `${size}px` }} onClick={action}>
            <div className="hamburger-menu-item"></div>
            <div className="hamburger-menu-item"></div>
            <div className="hamburger-menu-item"></div>
        </div>
    )
}

export default HamburgerMenu;
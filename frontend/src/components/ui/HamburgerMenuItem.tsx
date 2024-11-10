interface HamburgerMenuItemProps {
    height: number
}

function HamburgerMenuItem({ height }: HamburgerMenuItemProps) {
    return (
        <div className="w-full bg-main-black rounded-[6px]" style={{ height: `${height}px` }}>
        </div>
    )
}

export default HamburgerMenuItem;
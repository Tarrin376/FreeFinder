interface SidebarDropdownElementProps {
    text: string,
    action: () => void
}

function SidebarDropdownElement({ action, text }: SidebarDropdownElementProps) {
    return (
        <p className="p-3 cursor-pointer hover:bg-hover-light-gray rounded-[8px] 
        transition-all ease-out duration-100" onClick={action}>
            {text}
        </p>
    )
}

export default SidebarDropdownElement;
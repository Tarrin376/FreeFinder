interface ToggleSwitchProps {
    toggle: boolean,
    title: string,
    text: string,
    updateToggle: (value: boolean) => void,
    styles?: string
}

function ToggleSwitch({ toggle, title, text, updateToggle, styles }: ToggleSwitchProps) {
    return (
        <div className={`flex items-start gap-3 ${styles}`}>
            <div className="w-[42px] h-[23px] bg-main-blue rounded-full relative 
            cursor-pointer flex-shrink-0" onClick={() => updateToggle(!toggle)}>
                <span className={`rounded-full bg-white w-[17px] h-[17px] absolute top-[3px] 
                transition-all ease-in duration-200 ${toggle ? "left-[3px]" : "right-[3px]"}`}>
                </span>
            </div>
            <div className="flex-grow">
                <h4 className="text-[15px]">
                    {title}
                </h4>
                <p className="text-sm text-side-text-gray">
                    {text}
                </p>
            </div>
        </div>
    )
}

export default ToggleSwitch;
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
            <div className={`w-[42px] h-[23px] ${toggle ? "bg-main-blue" : "bg-light-border-gray"} rounded-full relative 
            cursor-pointer flex-shrink-0 transition-all ease-in-out duration-200`} onClick={() => updateToggle(!toggle)}>
                <span className={`rounded-full bg-white w-[17px] h-[17px] absolute top-[3px] 
                transition-all ease-in-out duration-200 ${toggle ? "translate-x-[calc(42px-100%-3px)]" : "translate-x-[3px]"}`}>
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
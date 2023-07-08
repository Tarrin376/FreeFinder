import CloseIcon from "../assets/close.png";

interface OptionsProps {
    options: string[],
    removeOption?: (option: string) => void,
    styles?: string,
    bgColour: string,
    textColour?: string
}

function Options({ options, removeOption, styles, bgColour, textColour }: OptionsProps) {
    function remove(option: string) {
        if (removeOption) {
            removeOption(option);
        }
    }

    return (
        <div className={`flex items-center gap-3 flex-wrap ${styles}`}>
            {options.map((cur: string, index: number) => {
                return (
                    <div className={`rounded-full py-1 px-3 flex items-center gap-2 
                    ${removeOption ? "cursor-pointer" : ""} ${bgColour}`} 
                    onClick={() => remove(cur)} key={index}>
                        <p className={`text-[14px] ${textColour}`}>{cur}</p>
                        {removeOption && 
                        <img 
                            src={CloseIcon} 
                            className="w-[13px] h-[13px]" 
                            alt="" 
                        />}
                    </div>
                )
            })}
        </div>
    )
}

export default Options;
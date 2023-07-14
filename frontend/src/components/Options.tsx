import CloseSvg from "./CloseSvg";

interface OptionsProps {
    options: string[],
    removeOption?: (option: string) => void,
    styles?: string,
    bgColour: string,
    textColour: string
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
                    <div className={`option ${removeOption ? "cursor-pointer" : ""} ${bgColour}`} 
                    onClick={() => remove(cur)} key={index}>
                        <p className="text-[14px]" style={{ color: textColour }}>{cur}</p>
                        {removeOption && 
                        <div className="min-w-[15px]">
                            <CloseSvg 
                                size="15px"
                                colour={textColour}
                            />
                        </div>}
                    </div>
                )
            })}
        </div>
    )
}

export default Options;
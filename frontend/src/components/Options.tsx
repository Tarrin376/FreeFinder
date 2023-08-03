import CloseSvg from "./CloseSvg";

interface OptionsProps {
    options: string[],
    removeOption?: (option: string) => void,
    wrapperStyles?: string,
    styles: string,
    textColour: string
}

function Options({ options, removeOption, wrapperStyles, styles, textColour }: OptionsProps) {
    const defaultStyles = `flex items-center gap-3 flex-wrap`;

    function remove(option: string) {
        if (removeOption) {
            removeOption(option);
        }
    }

    return (
        <div className={`${defaultStyles} ${wrapperStyles}`}>
            {options.map((cur: string, index: number) => {
                return (
                    <div className={`option ${removeOption ? "cursor-pointer" : ""} ${styles}`} 
                    onClick={() => remove(cur)} key={index}>
                        <p className="text-[14px]" style={{ color: textColour }}>{cur}</p>
                        {removeOption && 
                        <div className="min-w-[15px]">
                            <CloseSvg 
                                size={15}
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
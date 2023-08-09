import FilterBoxWrapper from "src/wrappers/FilterBoxWrapper"

interface PriceProps {
    value: number,
    maxValue?: number,
    text: string,
    updateValue: (cur: number) => void
}

function Price({ value, maxValue, text, updateValue }: PriceProps) {
    const update = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = e.target.value;
        if (nextValue.match(new RegExp(`[0-9]+$`)) && (!maxValue || parseInt(nextValue) <= maxValue)) {
            updateValue(parseInt(nextValue));
        } else if (nextValue === "") {
            updateValue(0);
        }
    }

    return (
        <FilterBoxWrapper text={text} wrapperStyles="max-w-[170px]">
            <div className="flex items-center">
                <p>£</p>
                <input 
                    type="text" 
                    className="bg-transparent ml-2 w-full focus:outline-none" 
                    value={value} 
                    onChange={update} 
                />
            </div>
        </FilterBoxWrapper>
    )
}

export default Price;
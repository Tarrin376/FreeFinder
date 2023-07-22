
interface PriceProps {
    value: number,
    maxValue?: number,
    title: string,
    setValue: React.Dispatch<React.SetStateAction<number>>,
}

function Price({ value, maxValue, title, setValue }: PriceProps) {
    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = e.target.value;
        if (nextValue.match(new RegExp(`[0-9]+$`)) && (!maxValue || parseInt(nextValue) <= maxValue)) {
            setValue(parseInt(nextValue));
        } else if (nextValue === "") {
            setValue(0);
        }
    }

    return (
        <div className="border border-light-border-gray rounded-[8px] w-[170px] px-3 py-2">
            <p className="text-sm text-side-text-gray">{title}</p>
            <div className="flex items-center">
                <p>£</p>
                <input 
                    type="text" 
                    className="bg-transparent ml-2 w-full focus:outline-none" 
                    value={value} 
                    onChange={updateValue} 
                />
            </div>
        </div>
    )
}

export default Price;
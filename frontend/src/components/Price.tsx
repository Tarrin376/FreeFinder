
interface PriceProps {
    value: React.MutableRefObject<number>,
    title: string,

}

function Price({ value, title }: PriceProps) {
    const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = e.target.value;
        if (nextValue.match(new RegExp(`[0-9]+$`))) {
            value.current = parseInt(nextValue);
        } else if (nextValue === "") {
            value.current = 0;
        }
    }

    return (
        <div className="border border-light-border-gray rounded-[8px] w-[200px] px-3 py-2">
            <p className="text-[13px] text-side-text-gray">{title}</p>
            <div className="flex items-center">
                <p>£</p>
                <input 
                    type="text" 
                    className="bg-transparent ml-2 mt-[3px] focus:outline-none" 
                    defaultValue={value.current} 
                    onChange={updateValue} 
                />
            </div>
        </div>
    )
}

export default Price;
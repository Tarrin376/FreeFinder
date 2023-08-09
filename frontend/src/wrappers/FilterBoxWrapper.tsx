
interface FilterBoxWrapperProps {
    children?: React.ReactNode,
    text: string,
    wrapperStyles?: string
}

function FilterBoxWrapper({ children, text, wrapperStyles }: FilterBoxWrapperProps) {
    return (
        <div className={`border border-light-border-gray rounded-[8px] px-3 py-2 ${wrapperStyles}`}>
            <p className="text-sm text-side-text-gray">
                {text}
            </p>
            {children}
        </div>
    )
}

export default FilterBoxWrapper;
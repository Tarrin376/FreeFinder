interface CountProps {
    value: number,
    styles?: string
}

function Count({ value, styles }: CountProps) {
    return (
        <div className={`bg-error-text rounded-full w-fit px-[7px] h-[20px] flex items-center justify-center ${styles}`}>
            <span className="text-xs text-main-white">
                {value}
            </span>
        </div>
    )
}

export default Count;
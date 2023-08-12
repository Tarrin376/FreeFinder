interface CountProps {
    value: number,
    styles?: string
}

function Count({ value, styles }: CountProps) {
    return (
        <div className={`bg-main-blue rounded-full w-fit px-[7px] h-[17px] flex items-center justify-center ${styles}`}>
            <span className="text-[11px] text-main-white">
                {value}
            </span>
        </div>
    )
}

export default Count;
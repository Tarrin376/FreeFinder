interface SummaryItemProps {
    label: string,
    value: string,
    styles?: string
}

function SummaryItem({ label, value, styles }: SummaryItemProps) {
    const defaultStyles = `flex justify-between gap-3`;

    return (
        <div className={`${defaultStyles} ${styles}`}>
            <p className="text-[15px] text-side-text-gray">{label}</p>
            <p className="text-[15px] text-side-text-gray">{value}</p>
        </div>
    )
}

export default SummaryItem;
interface DateOccurredProps {
    date: string,
    dateBgColour: string
}

function DateOccurred({ date, dateBgColour }: DateOccurredProps) {
    return (
        <div className="w-full bg-light-border-gray h-[1px] mb-6 flex items-center justify-center">
            <p className="text-sm text-side-text-gray px-3" style={{ backgroundColor: dateBgColour }}>
                {date === new Date().toLocaleDateString() ? "Today" : date}
            </p>
        </div>
    )
}

export default DateOccurred;
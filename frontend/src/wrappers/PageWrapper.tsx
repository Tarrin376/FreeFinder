
interface PageWrapperProps {
    children?: React.ReactNode,
    styles?: string,
    locationStack?: string[]
}

function PageWrapper({ children, styles, locationStack }: PageWrapperProps) {
    const defaultStyles = `max-w-[1430px] m-auto p-7 min-h-[calc(100vh-90px)]`;

    return (
        <div className={`${defaultStyles} ${styles}`}>
            {locationStack && 
            <p className="max-w-[800px] whitespace-nowrap text-ellipsis overflow-hidden text-[15px] mb-[42px] text-side-text-gray"
            title={locationStack.join(" / ")}>
                {locationStack.slice(0, -1).join(" / ")}
                <span className="text-[15px]">
                    {` / ${locationStack[locationStack.length - 1]}`}
                </span>
            </p>}
            {children}
        </div>
    )
}

export default PageWrapper;
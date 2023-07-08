
interface PageWrapperProps {
    children?: React.ReactNode,
    styles?: string,
    locationStack?: string[]
}

function PageWrapper({ children, styles, locationStack }: PageWrapperProps) {
    return (
        <div className={`max-w-[1494px] m-auto p-[22.5px] min-h-[calc(100vh-90px)] ${styles}`}>
            {locationStack && 
            <p className="max-w-[400px] whitespace-nowrap text-ellipsis overflow-hidden 
            text-[18px] mb-[50px] text-side-text-gray">
                {locationStack.slice(0, -1).join(" > ")}
                <span className="text-[18px]">
                    {` > ${locationStack[locationStack.length - 1]}`}
                </span>
            </p>}
            {children}
        </div>
    )
}

export default PageWrapper;
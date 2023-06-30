
interface PageWrapperProps {
    children?: React.ReactNode,
    styles?: string
}

function PageWrapper({ children, styles }: PageWrapperProps) {
    return (
        <div className={`page ${styles}`}>
            {children}
        </div>
    )
}

export default PageWrapper;
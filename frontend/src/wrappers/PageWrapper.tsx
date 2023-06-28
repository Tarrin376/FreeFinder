
interface PageWrapperProps {
    children?: React.ReactNode
}

function PageWrapper({ children }: PageWrapperProps) {
    return (
        <div className="page">
            {children}
        </div>
    )
}

export default PageWrapper;
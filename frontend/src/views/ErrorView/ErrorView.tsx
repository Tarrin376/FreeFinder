import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PageWrapper from "../../wrappers/PageWrapper";

interface ErrorProps {
    title: string,
    errorMessage: string
}

function ErrorView({ title, errorMessage }: ErrorProps) {
    const location = useLocation();

    return (
        <PageWrapper>
            <h1 className="text-[60px] mt-24">{location.state.title ? location.state.title : title}</h1>
            <h1 className="text-[26px]">
                <span className="text-error-text text-[26px]">Error:</span>
                {` ${location.state.errorMessage ? location.state.errorMessage : errorMessage}`}
            </h1>
            <Link to="/">
                <button className="btn-primary bg-main-blue mt-6 text-main-white hover:bg-main-blue-hover">
                    Back Home
                </button>
            </Link>
        </PageWrapper>
    )
}

export default ErrorView;
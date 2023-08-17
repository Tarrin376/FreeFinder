import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PageWrapper from "../../wrappers/PageWrapper";
import { useWindowSize } from "src/hooks/useWindowSize";

interface ErrorProps {
    title: string,
    errorMessage: string
}

function ErrorView({ title, errorMessage }: ErrorProps) {
    const location = useLocation();
    const windowSize = useWindowSize();

    return (
        <PageWrapper>
            <h1 className={`${windowSize >= 840 ? "text-[55px]" : windowSize >= 600 ? "text-[45px]" : "text-[35px]"}
            ${windowSize <= 320 ? "text-center" : ""} mt-20`}>
                {location.state.title ? location.state.title : title}
            </h1>
            <h1 className={`${windowSize >= 840 ? "text-[25px]" : windowSize >= 600 ? "text-[22px]" : "text-[20px]"} 
            ${windowSize <= 320 ? "text-center" : ""}`}>
                {` ${location.state.errorMessage ? location.state.errorMessage : errorMessage}`}
            </h1>
            <Link to="/">
                <button className={`btn-primary block bg-main-blue mt-5 text-main-white hover:bg-main-blue-hover
                ${windowSize <= 320 ? "m-auto" : ""}`}>
                    Back Home
                </button>
            </Link>
        </PageWrapper>
    )
}

export default ErrorView;
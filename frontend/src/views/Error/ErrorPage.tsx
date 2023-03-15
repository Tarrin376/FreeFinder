import { Link } from "react-router-dom";

function ErrorPage() {
    return (
        <div className="page">
            <h1 className="text-[80px] mt-24">404</h1>
            <h1 className="text-[40px]">This is not the page you are looking for...</h1>
            <Link to="/">
                <button className="btn-primary bg-main-purple mt-4 text-main-white hover:bg-main-purple-hover">
                    Home Page
                </button>
            </Link>
        </div>
    )
}

export default ErrorPage;
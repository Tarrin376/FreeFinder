import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
    const [search, setSearch] = useState<string>("");
    const navigate = useNavigate();

    function findServices() {
        const filters = JSON.parse(sessionStorage.getItem("post_filters") ?? "{}");
        sessionStorage.setItem("post_filters", JSON.stringify({ ...filters, search }));
        navigate("/posts/all");
    }

    return (
        <div className="pt-10">
            <h1 className="text-main-blue text-[39px] mb-4">
                Find the best freelance jobs
            </h1>
            <p className="max-w-[570px] mb-7">
                Browse services posted on FreeFinder, or create a free profile to find the work that you love to do.
            </p>
            <form onSubmit={findServices}>
                <input 
                    type="text" 
                    placeholder="Search for the service you are looking for" 
                    className="search-bar max-w-[27.5rem]" 
                    onChange={(e) => setSearch(e.target.value)} 
                />
                <button className="btn-primary bg-main-black text-main-white hover:bg-main-black-hover mt-5" type="submit">
                    Find Services
                </button>
            </form>
        </div>
    );
}

export default Header;
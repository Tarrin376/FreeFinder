
function Header() {
    return (
        <div className="mt-24">
            <h1 className="text-main-purple text-[39px] mb-4">
                Find the best freelance jobs
            </h1>
            <p className="max-w-[570px] mb-7">
                Browse jobs posted on Upwork, or jump right in and create a free profile to find the work that you love to do.
            </p>
            <input type="text" placeholder="Search for the service you are looking for" className="search-bar max-w-[27.5rem]" />
            <button className="btn-primary bg-main-black text-main-white hover:bg-main-black-hover mt-5">
                Find Services
            </button>
        </div>
    );
}

export default Header;
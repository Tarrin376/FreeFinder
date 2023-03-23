function SavedServicesView() {
    return (
        <div className="page">
            <h1 className="text-3xl mb-11">My Saved Services</h1>
            <div className="flex justify-between w-full items-center">
                <input type="text" placeholder="Search by term or seller" className="search-bar max-w-[27.5rem]" />
                <div className="flex items-center gap-4">
                    <p>Sort by</p>
                    <select className="p-2 bg-main-white rounded-[8px] border border-nav-search-gray cursor-pointer">
                        <option>recent</option>
                        <option>Seller rating</option>
                        <option>date posted</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default SavedServicesView;
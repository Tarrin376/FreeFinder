import { allExtraFilters } from "../utils/allExtraFilters";

interface ExtraFiltersProps {
    loading: boolean,
    extraFilters: string[],
    setExtraFilters: React.Dispatch<React.SetStateAction<string[]>>
}

function ExtraFilters({ loading, extraFilters, setExtraFilters }: ExtraFiltersProps) {
    function toggleFilter(filter: string) {
        setExtraFilters((cur: string[]) => {
            if (cur.includes(filter)) return cur.filter((x) => x !== filter);
            else return [...cur, filter];
        });
    }

    return (
        <>
            <h3 className="text-side-text-gray mt-4 mb-2 text-[16px]">Extra</h3>
            <div className="flex flex-col gap-2">
                {allExtraFilters.map((filter: string, index: number) => {
                    return (
                        <div className="flex items-center gap-3" key={index}>
                            <input 
                                type="checkbox" 
                                name="seller-level" 
                                className={`w-[15px] h-[15px] mt-[1px] ${loading ? "invalid-button" : ""}`}
                                id={filter}
                                onChange={() => toggleFilter(filter)}
                                defaultChecked={extraFilters.includes(filter)}
                            />
                            <label htmlFor={filter} className="text-[15px]">
                                {filter}
                            </label>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default ExtraFilters;
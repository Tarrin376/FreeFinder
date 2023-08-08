import { allExtraFilters } from "../utils/allExtraFilters";

interface ExtraFiltersProps {
    loading: boolean,
    extraFilters: string[],
    updateExtraFilters: (extraFilters: string[]) => void
}

function ExtraFilters({ loading, extraFilters, updateExtraFilters }: ExtraFiltersProps) {
    function toggleFilter(filter: string) {
        if (extraFilters.includes(filter)) return extraFilters.filter((x) => x !== filter);
        else return [...extraFilters, filter];
    }

    return (
        <>
            <h3 className="text-side-text-gray mt-5 mb-2 text-[16px]">Extra</h3>
            <div className="flex flex-col gap-2">
                {allExtraFilters.map((filter: string, index: number) => {
                    return (
                        <div className="flex items-center gap-3" key={index}>
                            <input 
                                type="checkbox" 
                                name="seller-level" 
                                className={`w-[15px] h-[15px] mt-[1px] ${loading ? "invalid-button" : ""}`}
                                id={filter}
                                onChange={() => updateExtraFilters(toggleFilter(filter))}
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
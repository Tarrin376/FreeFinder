import FilterIcon from "../../assets/filter.png";
import Count from "../Count";

interface FiltersButtonProps {
    toggleFiltersPopUp: () => void,
    modifiedFiltersCount: number,
    styles?: string
}

function FiltersButton({ toggleFiltersPopUp, modifiedFiltersCount, styles }: FiltersButtonProps) {
    const defaultStyles = `relative side-btn !h-[48px] w-[110px] flex items-center justify-center gap-[5px]`;

    return (
        <button className={`${defaultStyles} ${styles}`} onClick={toggleFiltersPopUp}>
            <img src={FilterIcon} className="w-[15px] h-[15px]" alt="" />
            <span className="text-main-blue">
                Filters
            </span>
            {modifiedFiltersCount > 0 &&
            <Count
                value={modifiedFiltersCount}
                styles="absolute top-[-7px] right-[-7px]"
            />}
        </button>
    )
}

export default FiltersButton;
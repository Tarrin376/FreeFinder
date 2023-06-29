import { sortPosts } from '../utils/sortPosts';

interface SortByProps {
    sortBy: React.MutableRefObject<string>,
}

function SortBy({ sortBy }: SortByProps) {
    function sort(value: string): void {
        sortBy.current = value;
    }

    return (
        <div className="flex items-center gap-4 w-fit">
            <select className="bg-main-white rounded-[8px] cursor-pointer focus:outline-none" 
            onChange={(e) => sort(e.target.value)} defaultValue={sortBy.current}>
                {Object.keys(sortPosts).map((param) => {
                    return (
                        <option key={param}>
                            {param}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

export default SortBy;
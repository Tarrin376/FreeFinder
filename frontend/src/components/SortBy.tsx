import { IPost } from '../models/IPost';
import { savedServicesKey } from '../views/SavedServicesView/SavedServicesView';

export const sortByParams: {
    [key: string]: string
} = {
    "most recent": "recent",
    "rating": "rating",
    "lowest price": "lowest-price",
    "highest price": "highest-price"
}

export type Cursor = string | savedServicesKey;

interface SortByProps {
    cursor: React.MutableRefObject<Cursor>,
    head: Cursor,
    sortBy: string,
    loading: boolean
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>,
    setReachedBottom: React.Dispatch<React.SetStateAction<boolean>>,
    setSortBy: React.Dispatch<React.SetStateAction<string>>,
}

function SortBy({ cursor, sortBy, setPosts, setReachedBottom, setSortBy, head, loading }: SortByProps) {
    function sortPosts(value: string) {
        if (!loading) {
            cursor.current = head;
            setPosts([]);
            setReachedBottom(false);
            setSortBy(sortByParams[value]);
        }
    }

    return (
        <div className="flex items-center gap-4">
            <p>Sort by</p>
            <select className="p-2 bg-main-white rounded-[8px] border-2 border-light-gray cursor-pointer"
                onChange={(e) => sortPosts(e.target.value)} defaultValue={sortBy}>
                {Object.keys(sortByParams).map((param) => {
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
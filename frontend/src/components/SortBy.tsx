import { IPost } from '../models/IPost';
import { SavedServicesKey } from '../types/SavedServicesKey';
import { sortPosts } from '../utils/sortPosts';

export type Cursor = string | SavedServicesKey;

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
    function sort(value: string): void {
        if (!loading) {
            cursor.current = head;
            setPosts([]);
            setReachedBottom(false);
            setSortBy(sortPosts[value]);
        }
    }

    return (
        <div className="flex items-center gap-4">
            <p>Sort by</p>
            <select className="p-2 bg-main-white rounded-[8px] border-2 border-light-gray cursor-pointer"
                onChange={(e) => sort(e.target.value)} defaultValue={sortBy}>
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
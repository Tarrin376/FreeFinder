import { IPost } from '../models/IPost';
import { sortPosts } from '../utils/sortPosts';

interface SortByProps {
    cursor: React.MutableRefObject<string>,
    head: string,
    sortBy: React.MutableRefObject<string>,
    loading: boolean
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>,
    setReachedBottom: React.Dispatch<React.SetStateAction<boolean>>,
}

function SortBy({ cursor, head, sortBy, loading, setPosts, setReachedBottom }: SortByProps) {
    function sort(value: string): void {
        if (!loading) {
            cursor.current = head;
            setPosts([]);
            setReachedBottom(false);
            sortBy.current = value;
        }
    }

    return (
        <div className="flex items-center gap-4 w-fit">
            <select className="bg-transparent rounded-[8px] cursor-pointer focus:outline-none" 
            onChange={(e) => sort(e.target.value)} value={sortBy.current}>
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
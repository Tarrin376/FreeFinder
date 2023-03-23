import { IPost } from '../models/IPost';

export const sortByParams = ["recent", "rating", "date"];

interface SortByProps {
    cursor: React.MutableRefObject<any>,
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>,
    setReachedBottom: React.Dispatch<React.SetStateAction<boolean>>,
    setSortBy: React.Dispatch<React.SetStateAction<string>>
}

function SortBy({ cursor, setPosts, setReachedBottom, setSortBy }: SortByProps) {
    function sortPosts(value: string) {
        cursor.current = "HEAD";
        setPosts([]);
        setReachedBottom(false);
        setSortBy(value);
    }

    return (
        <select className="p-2 bg-main-white rounded-[8px] border-2 border-light-gray cursor-pointer"
            onChange={(e) => sortPosts(e.target.value)}>
            {sortByParams.map((param) => {
                return (
                    <option key={param}>
                        {param}
                    </option>
                );
            })}
        </select>
    );
}

export default SortBy;
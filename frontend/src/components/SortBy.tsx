import { sortPosts } from '../utils/sortPosts';
import NavDropdown from './NavDropdown';
import { sortPostsOption } from 'src/types/sortPostsOption';

interface SortByProps {
    sort: sortPostsOption,
    updateSort: (nextSort: sortPostsOption) => void
}

function SortBy({ sort, updateSort }: SortByProps) {
    return (
        <div className="relative h-full">
            <NavDropdown 
                styles="absolute top-1/2 translate-y-[-50%] left-1/2 translate-x-[-50%] w-fit"
                textSize={16}
                title={sort}
                items={Object.keys(sortPosts).map((param) => {
                    return [param, () => updateSort(param as sortPostsOption)]
                })} 
            />
            <div className="collapse px-[12px]">
                {Object.keys(sortPosts).reduce((acc, cur) => cur.length > acc.length ? cur : acc, "")}
            </div>
        </div>
    );
}

export default SortBy;
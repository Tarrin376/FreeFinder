import { sortPosts } from '../utils/sortPosts';
import NavDropdown from './NavDropdown';
import { sortPostsOption } from 'src/types/sortPostsOption';
import DropdownElement from './DropdownElement';

interface SortByProps {
    sort: sortPostsOption,
    updateSort: (nextSort: sortPostsOption) => void
}

function SortBy({ sort, updateSort }: SortByProps) {
    return (
        <div className="relative h-full">
            <NavDropdown styles="absolute top-1/2 translate-y-[-50%] left-1/2 translate-x-[-50%] w-fit" textSize={16} title={sort}>
                {Object.keys(sortPosts).map((param: string, index: number) => {
                    return (
                        <DropdownElement
                            text={param}
                            action={() => updateSort(param as sortPostsOption)}
                            key={index}
                        />
                    )
                })}
            </NavDropdown>
            <div className="collapse px-[12px]">
                {Object.keys(sortPosts).reduce((acc, cur) => cur.length > acc.length ? cur : acc, "")}
            </div>
        </div>
    );
}

export default SortBy;
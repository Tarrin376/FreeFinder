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
        <div className={`relative h-full flex items-center w-fit`}>
            <div className="flex items-center gap-2">
                <span className="text-side-text-gray">Sort by:</span>
                <NavDropdown textSize={16} title={sort}>
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
            </div>
        </div>
    );
}

export default SortBy;
import { useState, useRef } from 'react';

function DragAndDrop({ children, handleDrop }: { children?: React.ReactNode, handleDrop: Function }) {
    const [dragging, setDragging] = useState<boolean>(false);
    const counter = useRef<number>(0);

    function dragInHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.stopPropagation();
        counter.current++;

        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragging(true);
        }
    }

    function dragOutHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.stopPropagation();
        counter.current--;

        if (counter.current === 0) {
            setDragging(false);
        }
    }

    function dragHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.stopPropagation();
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleDrop(e.dataTransfer.files);
            counter.current = 0;
        }
    }
    
    return (
        <div onDragEnter={dragInHandler} onDragLeave={dragOutHandler} onDragOver={dragHandler} onDrop={dropHandler}
        className={`w-full h-[260px] outline-2 outline-dashed rounded-[8px] relative
        ${dragging ? 'outline-main-blue bg-[#2375e109]' : 'outline-light-gray'}`}>
            {children}
        </div>
    )
}

export default DragAndDrop;
import { useState, useRef } from 'react';

interface DragAndDropProps {
    children?: React.ReactNode,
    handleDrop: (files: FileList) => void,
    styles?: string
}

function DragAndDrop({ children, handleDrop, styles }: DragAndDropProps) {
    const [dragging, setDragging] = useState<boolean>(false);
    const counter = useRef<number>(0);
    const defaultStyles = `w-full h-[260px] outline-2 outline-dashed rounded-[8px] relative`;

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
        className={`${defaultStyles} ${dragging ? 'outline-main-blue bg-[#f8f9ff]' : 'outline-light-gray'} ${styles}`}>
            {children}
        </div>
    )
}

export default DragAndDrop;
interface StarProps {
    size: number
}

function Star({ size }: StarProps) {
    return (
        <div className="bg-main-white" style={{ width: `${size}px`, height: `${size}px` }}>

        </div>
    );
}

export default Star;
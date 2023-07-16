
interface StarSvgProps {
    backgroundColour: string,
    size: string,
    action?: () => void,
    styles?: string
}

function StarSvg({ backgroundColour, size, action, styles }: StarSvgProps) {
    function handleClick() {
        if (action) {
            action();
        }
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="Star" width={size} height={size} onClick={handleClick}>
            <path d="M480 200H308.519l-52.49-168-52.51 168H32l138.946 104.209L116 480l140-112 140 112-54.927-175.805z" 
            fill={backgroundColour} className={`color000000 svgShape ${styles}`}>
            </path>
        </svg>
    )
}

export default StarSvg;

interface StarSvgProps {
    backgroundColour: string,
    size: number,
    action?: () => void,
    styles?: string,
    wrapperStyles?: string
}

function StarSvg({ backgroundColour, size, action, styles, wrapperStyles }: StarSvgProps) {
    function handleClick(): void {
        if (action) {
            action();
        }
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="Star" width={`${size}px`} 
        height={`${size}px`} onClick={handleClick} className={wrapperStyles}>
            <path d="M480 200H308.519l-52.49-168-52.51 168H32l138.946 104.209L116 480l140-112 140 112-54.927-175.805z" 
            fill={backgroundColour} className={styles}>
            </path>
        </svg>
    )
}

export default StarSvg;
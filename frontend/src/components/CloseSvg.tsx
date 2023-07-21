interface CloseSvgProps {
    size: string,
    colour?: string,
    action?: () => void
}

function CloseSvg({ size, colour, action }: CloseSvgProps) {
    function handleClick(): void {
        if (action) {
            action();
        }
    }

    return (
        <div style={{ minWidth: `${size}px` }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" width={size} height={size} fillRule="nonzero"
            onClick={handleClick} className="cursor-pointer">
                <g fillOpacity="0" fill="#dddddd" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" 
                strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" 
                fontWeight="none" fontSize="none" textAnchor="none">
                    <path d="M0,256v-256h256v256z" id="bgRectangle">
                    </path>
                </g>
                <g fill={colour} fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" 
                strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" 
                fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none">
                    <g transform="scale(8,8)">
                        <path d="M7.21875,5.78125l-1.4375,1.4375l8.78125,8.78125l-8.78125,8.78125l1.4375,1.4375l8.78125,-8.78125l8.78125,8.78125l1.4375,-1.4375l-8.78125,-8.78125l8.78125,-8.78125l-1.4375,-1.4375l-8.78125,8.78125z">
                        </path>
                    </g>
                </g>
            </svg>
        </div>
    )
}

export default CloseSvg;
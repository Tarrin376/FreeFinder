interface CloseSvgProps {
    size: string,
    colour?: string,
    action?: () => void
}

function CloseSvg({ size, colour, action }: CloseSvgProps) {
    function handleClick() {
        if (action) {
            action();
        }
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" width={size} height={size} fill-rule="nonzero"
        onClick={handleClick} className="cursor-pointer">
            <g fill-opacity="0" fill="#dddddd" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" 
            stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" 
            font-weight="none" font-size="none" text-anchor="none">
                <path d="M0,256v-256h256v256z" id="bgRectangle">
                </path>
            </g>
            <g fill={colour} fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" 
            stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" 
            font-family="none" font-weight="none" font-size="none" text-anchor="none">
                <g transform="scale(8,8)">
                    <path d="M7.21875,5.78125l-1.4375,1.4375l8.78125,8.78125l-8.78125,8.78125l1.4375,1.4375l8.78125,-8.78125l8.78125,8.78125l1.4375,-1.4375l-8.78125,-8.78125l8.78125,-8.78125l-1.4375,-1.4375l-8.78125,8.78125z">
                    </path>
                </g>
            </g>
        </svg>
    )
}

export default CloseSvg;

interface CheckMarkProps {
    size: number,
    styles?: string
}

function CheckMark({ size, styles }: CheckMarkProps) {
    return (
        <svg version="1.1" id="Layer_1" width={`${size}px`} height={`${size}px`} xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 48" xmlSpace="preserve" className={styles}>
            <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="9.8581" y1="9.8581" x2="38.1419" y2="38.1419">
                <stop  offset="0" style={{ stopColor: "#9DFFCE" }} />
                <stop  offset="1" style={{ stopColor: "#50D18D" }} />
            </linearGradient>
            <path style={{ fill: "url(#SVGID_1_)" }} d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"/>
            <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="13.0002" y1="24.7931" x2="35.9998" y2="24.7931">
                <stop  offset="0.8237" style={{ stopColor: "#135D36" }} />
                <stop  offset="0.9306" style={{ stopColor: "#125933" }} />
                <stop  offset="0.9998" style={{ stopColor: "#11522F" }} />
            </linearGradient>
            <path style={{ fill: "url(#SVGID_2_)" }} d="M21.293,32.707l-8-8c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414
                c0.391-0.391,1.024-0.391,1.414,0L22,27.758l10.879-10.879c0.391-0.391,1.024-0.391,1.414,0l1.414,1.414
                c0.391,0.391,0.391,1.024,0,1.414l-13,13C22.317,33.098,21.683,33.098,21.293,32.707z"/>
        </svg>
    )
}

export default CheckMark;
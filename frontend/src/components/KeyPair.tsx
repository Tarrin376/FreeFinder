interface KeyPairProps {
    itemKey: string,
    itemValue: string,
    styles?: string,
    textSize: number
}

function KeyPair({ itemKey, itemValue, styles, textSize }: KeyPairProps) {
    return (
        <p className={`${styles} text-ellipsis whitespace-nowrap overflow-hidden`} style={{ fontSize: `${textSize}px` }}>
            {`${itemKey}:`}
            <span className="text-main-blue" style={{ fontSize: `${textSize}px` }}>
                {` ${itemValue}`}
            </span>
        </p>
    )
}

export default KeyPair;
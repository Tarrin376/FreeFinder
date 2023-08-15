interface KeyPairProps {
    itemKey: string,
    itemValue: string,
    styles?: string,
    textSize: number
}

function KeyPair({ itemKey, itemValue, styles, textSize }: KeyPairProps) {
    const defaultStyles = `text-ellipsis whitespace-nowrap overflow-hidden`;
    
    return (
        <p className={`${defaultStyles} ${styles}`} style={{ fontSize: `${textSize}px` }}>
            {`${itemKey}:`}
            <span className="text-main-blue" style={{ fontSize: `${textSize}px` }} title={itemValue}>
                {` ${itemValue}`}
            </span>
        </p>
    )
}

export default KeyPair;
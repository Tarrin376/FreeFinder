interface KeyPairProps {
    itemKey: string,
    itemValue: string,
    textSize: number
    styles?: string,
}

function KeyPair({ itemKey, itemValue, textSize, styles }: KeyPairProps) {
    const defaultStyles = `text-ellipsis whitespace-nowrap overflow-hidden`;
    
    return (
        <p className={`${defaultStyles} ${styles}`} style={{ fontSize: `${textSize}px` }}>
            {`${itemKey}:`}
            <span className="text-main-blue" style={{ fontSize: `${textSize}px`, marginLeft: '3px' }} title={itemValue}>
                {` ${itemValue}`}
            </span>
        </p>
    )
}

export default KeyPair;
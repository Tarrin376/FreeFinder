interface TypingDotProps {
    index: number
    styles?: string
}

function TypingDot({ index, styles }: TypingDotProps) {
    const defaultStyles = `w-[6px] h-[6px] rounded-full bg-side-text-gray opacity-0 animate-user-typing`;

    return (
        <span 
            className={`${defaultStyles} ${styles}`}
            style={{ animationDelay: `${0.2 * index}s` }}
            key={index}>
        </span>
    )
}

export default TypingDot;
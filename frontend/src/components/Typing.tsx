
interface TypingProps {
    usersTyping: string[],
    textStyles?: string,
    dotStyles?: string,
}

function Typing({ usersTyping, textStyles, dotStyles }: TypingProps) {
    function showUsersTyping(): string {
        if (usersTyping.length === 1) return `${usersTyping[0]} is typing`;
        else if (usersTyping.length === 2) return `${usersTyping[0]} and ${usersTyping[1]} are typing`;
        else if (usersTyping.length === 3) return `${usersTyping[0]}, ${usersTyping[1]}, and ${usersTyping[2]} are typing`;
        else return "Several people are typing";
    }
    
    return (
        <div className={`flex gap-2 items-center w-fit ${usersTyping.length === 0 ? "collapse" : ""}`}>
            <div className="flex gap-[4px]">
                {new Array(3).fill(0).map((_, index) => {
                    return (
                        <span 
                            className={`dot ${dotStyles}`}
                            style={{ animationDelay: `${0.2 * index}s` }}
                            key={index}>
                        </span>
                    )
                })}
            </div>
            <p className={`text-side-text-gray text-[15px] ${textStyles}`}>
                {showUsersTyping()}
            </p>
        </div>
    );
}

export default Typing;
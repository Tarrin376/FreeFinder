import TypingDot from "../common/TypingDot";
import { useUsersTyping } from "src/hooks/useUsersTyping";

interface TypingProps {
    groupID: string,
    textStyles?: string,
    dotStyles?: string,
    styles?: string
}

function UsersTyping({ groupID, textStyles, dotStyles, styles }: TypingProps) {
    const usersTyping = useUsersTyping(groupID);

    function showUsersTyping(): string {
        if (usersTyping.length === 1) return `${usersTyping[0]} is typing`;
        else if (usersTyping.length === 2) return `${usersTyping[0]} and ${usersTyping[1]} are typing`;
        else if (usersTyping.length === 3) return `${usersTyping[0]}, ${usersTyping[1]}, and ${usersTyping[2]} are typing`;
        else return "Several people are typing";
    }

    if (usersTyping.length === 0) {
        return <></>
    }
    
    return (
        <div className={`flex gap-2 items-center w-fit ${styles}`}>
            <div className="flex gap-[4px]">
                {new Array(3).fill(0).map((_, index) => {
                    return (
                        <TypingDot
                            index={index}
                            styles={dotStyles}
                            key={index}
                        />
                    )
                })}
            </div>
            <p className={`text-side-text-gray text-[15px] ${textStyles}`}>
                {showUsersTyping()}
            </p>
        </div>
    );
}

export default UsersTyping;
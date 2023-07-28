import { GroupPreview } from "../types/GroupPreview";
import { useContext } from "react";
import { UserContext } from "../providers/UserContext";

interface TagsProps {
    isOwnMessage: boolean,
    messageText: string,
    groupMembers: GroupPreview["members"],
    styles?: string
}

function Tags({ isOwnMessage, messageText, groupMembers, styles }: TagsProps) {
    const userContext = useContext(UserContext);
    const words = messageText.split(" ");

    function mentionedUser(word: string): boolean {
        return word[0] === "@" && groupMembers.find((x) => x.user.username === word.substring(1)) !== undefined; 
    }

    return (
        <>
            {words.map((word: string, index: number) => {
                return (
                    <span className={`${styles} ${mentionedUser(word) ? `font-bold 
                    ${word === `@${userContext.userData.username}` || isOwnMessage ? "!text-main-blue" : ""}` : 
                    isOwnMessage ? "!text-main-blue" : ""}`} key={index}>
                        {index < words.length - 1 ? `${word} ` : word}
                    </span>
                );
            })}
        </>
    )
}

export default Tags;
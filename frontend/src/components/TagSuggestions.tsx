import { useEffect, useState, useRef } from "react";
import { getMatchedResults } from "../utils/getMatchedResults";
import { GroupPreview } from "../types/GroupPreview";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import HighlightedSubstring from "./HighlightedSubstring";
import { ChatBoxState } from "./ChatBox";

interface TagSuggestionsProps {
    tag: string,
    groupMembers: GroupPreview["members"],
    searchRef: React.RefObject<HTMLInputElement>,
    dispatch: React.Dispatch<Partial<ChatBoxState>>
}

function TagSuggestions({ tag, groupMembers, searchRef, dispatch }: TagSuggestionsProps) {
    const [matchedMembers, setMatchedMembers] = useState<string[][]>([]);
    const usernameMappings = useRef<{ [key: string]: GroupPreview["members"][number] }>({});

    useEffect(() => {
        const matchedResults = getMatchedResults(groupMembers.map(x => x.user.username), tag, true);
        setMatchedMembers(matchedResults);
    }, [tag, groupMembers]);

    useEffect(() => {
        for (const groupMember of groupMembers) {
            usernameMappings.current[groupMember.user.username] = groupMember;
        }
    }, [groupMembers]);

    function autoCompleteTag(username: string) {
        if (!searchRef.current) {
            return;
        }

        let index = searchRef.current.value.length - 1;
        while (index >= 0 && searchRef.current.value[index] !== "@") {
            index--;
        }

        if (index >= 0) {
            searchRef.current.value = `${searchRef.current.value.substring(0, index + 1)}${username} `;
            searchRef.current.focus();
        }

        dispatch({ 
            showTagSuggestions: false, 
            tag: "" 
        });
    }

    return (
        <div className="absolute bg-main-white bottom-[calc(100%-30px)] left-3 z-20 shadow-pop-up rounded-[8px] w-[300px] max-h-[300px] p-1
        overflow-y-scroll flex flex-col">
            {matchedMembers.map((pair: string[], index: number) => {
                return (
                    <div className="flex justify-between items-center gap-[8px] hover:bg-[#f7f7f7] rounded-[6px] p-2 cursor-pointer" key={index}
                    onClick={() => autoCompleteTag(pair[0])}>
                        <div className="flex items-center gap-3 overflow-hidden">
                            <ProfilePicAndStatus
                                profilePicURL={usernameMappings.current[pair[0]].user.profilePicURL}
                                profileStatus={usernameMappings.current[pair[0]].user.status}
                                statusStyles="before:hidden"
                                username={usernameMappings.current[pair[0]].user.username}
                                size={37}
                            />
                            <HighlightedSubstring
                                word={pair[0]}
                                substring={tag}
                                foundAt={parseInt(pair[1])}
                                styles="hover:px-0"
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default TagSuggestions;
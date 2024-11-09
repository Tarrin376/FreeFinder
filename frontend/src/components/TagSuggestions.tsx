import { useEffect, useCallback } from "react";
import { getMatchedResults } from "../utils/getMatchedResults";
import { GroupPreview } from "../types/GroupPreview";
import ProfilePicAndStatus from "./Profile/ProfilePicAndStatus";
import HighlightedSubstring from "./HighlightedSubstring";
import { ChatBoxState } from "../views/LiveChat/CurrentGroupChat/ChatBox";
import { MatchedMembers } from "../types/MatchedMembers";
import { TAG_SUGGESTIONS_HEIGHT } from "../views/LiveChat/CurrentGroupChat/ChatBox";

interface TagSuggestionsProps {
    tag: string,
    groupMembers: GroupPreview["members"],
    inputRef: React.RefObject<HTMLInputElement>,
    dispatch: React.Dispatch<Partial<ChatBoxState>>,
    selectedTagIndex: number,
    matchedMembers: MatchedMembers,
    suggestionsRef: React.RefObject<HTMLDivElement>
}

function TagSuggestions({ tag, groupMembers, inputRef, dispatch, matchedMembers, selectedTagIndex, suggestionsRef }: TagSuggestionsProps) {
    const autoCompleteTag = useCallback((username: string): number => {
        if (!inputRef.current) {
            return -1;
        }

        let index = inputRef.current.value.length - 1;
        let lastWhitespace = inputRef.current.value.length;

        while (index >= 0 && inputRef.current.value[index] !== "@") {
            if (inputRef.current.value[index] === " ") lastWhitespace = index;
            index--;
        }

        if (index >= 0) {
            inputRef.current.value = `${inputRef.current.value.substring(0, index + 1)}${username} ${inputRef.current.value.substring(lastWhitespace)}`;
            inputRef.current.focus();
        }

        dispatch({ 
            toggleTagSuggestions: false, 
            tag: "" 
        });

        return index;
    }, [inputRef, dispatch]);

    const enterHandler = useCallback(({ key }: { key: string }) => {
        if (!inputRef.current || matchedMembers.length === 0) {
            return;
        }

        const username = matchedMembers[selectedTagIndex].user.username;
        if (key === "Enter") {
            const index = autoCompleteTag(username);
            dispatch({ toggleTagSuggestions: false });

            if (index !== -1) {
                inputRef.current.selectionStart = index + username.length + 2;
                inputRef.current.selectionEnd = index + username.length + 2;
                inputRef.current.focus();
            }
        }
    }, [inputRef, autoCompleteTag, dispatch, matchedMembers, selectedTagIndex]);

    useEffect(() => {
        const matchedResults = getMatchedResults(groupMembers.map(member => member.user.username), tag, true, true);
        dispatch({ 
            matchedMembers: groupMembers
            .filter(member => matchedResults.some((x) => x[0] === member.user.username))
            .map((member) => {
                return {
                    ...member,
                    foundAt: parseInt(matchedResults.find((x) => x[0] === member.user.username)![1])
                };
            })
        });
    }, [tag, groupMembers, dispatch]);

    useEffect(() => {
        const ref = inputRef.current;
        ref?.addEventListener("keyup", enterHandler);

        return () => {
            ref?.removeEventListener("keyup", enterHandler);
        }
    }, [inputRef, enterHandler]);

    return (
        <div className="absolute bg-main-white bottom-[calc(100%-30px)] left-3 z-20 shadow-pop-up rounded-[8px] w-[300px] p-1
        overflow-y-scroll flex flex-col" ref={suggestionsRef} style={{ maxHeight: `${TAG_SUGGESTIONS_HEIGHT}px` }}>
            {matchedMembers.map((member: MatchedMembers[number], index: number) => {
                return (
                    <div className={`flex justify-between items-center gap-[8px] hover:bg-hover-light-gray rounded-[6px] p-2 cursor-pointer
                    ${selectedTagIndex === index ? "bg-hover-light-gray" : ""}`} key={index} onClick={() => autoCompleteTag(member.user.username)}>
                        <div className="flex items-center gap-3 overflow-hidden">
                            <ProfilePicAndStatus
                                profilePicURL={member.user.profilePicURL}
                                username={member.user.username}
                                size={37}
                            />
                            <HighlightedSubstring
                                word={member.user.username}
                                substring={tag}
                                foundAt={member.foundAt}
                                styles="hover:!px-0"
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default TagSuggestions;
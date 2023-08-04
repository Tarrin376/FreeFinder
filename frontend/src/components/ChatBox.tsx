import { usePaginateData } from "../hooks/usePaginateData";
import { IMessage } from "../models/IMessage";
import { useState, useRef, useContext, useEffect, useCallback, useReducer } from "react";
import { UserContext } from "../providers/UserContext";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import axios, { AxiosError } from "axios";
import SendIcon from "../assets/send.png";
import { AnimatePresence } from "framer-motion";
import ErrorPopUp from "./ErrorPopUp";
import { PaginationResponse } from "../types/PaginateResponse";
import Typing from "./Typing";
import { useUsersTyping } from "../hooks/useUsersTyping";
import AttachIcon from "../assets/attach.png";
import EmojiIcon from "../assets/emoji.png";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { motion } from "framer-motion";
import AttachFiles from "./AttachFiles";
import { FileData } from "../types/FileData";
import UploadedFile from "./UploadedFile";
import { GroupPreview } from "../types/GroupPreview";
import TagSuggestions from "./TagSuggestions";
import { FailedUpload } from "../types/FailedUploaded";
import { IMessageFile } from "../models/IMessageFile";
import SupportedFileFormats from "./SupportedFileFormats";
import { MatchedMembers } from "../types/MatchedMembers";
import { useArrowNavigation } from "../hooks/useArrowNavigation";
import { FoundUsers } from "../types/FoundUsers";
import Messages from "./Messages";

interface ChatBoxProps {
    seller: FoundUsers[number],
    workType: string,
    groupID: string,
    groupMembers: GroupPreview["members"]
}

export type ChatBoxState = {
    sendingMessage: boolean,
    toggleEmojiPicker: boolean,
    toggleAttachFiles: boolean,
    toggleTagSuggestions: boolean,
    tag: string,
    newMessages: IMessage[],
    uploadedFiles: FileData[],
    failedUploads: FailedUpload[],
    matchedMembers: MatchedMembers
}

const initialState: ChatBoxState = {
    sendingMessage: false,
    toggleEmojiPicker: false,
    toggleAttachFiles: false,
    toggleTagSuggestions: false,
    tag: "",
    newMessages: [],
    failedUploads: [],
    uploadedFiles: [],
    matchedMembers: [],
}

export const tagSuggestionHeight = 273;

function ChatBox({ seller, workType, groupID, groupMembers }: ChatBoxProps) {
    const userContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [page, setPage] = useState<{ value: number }>({ value: 1 });

    const [toggleSupportedFormats, setToggleSupportedFormats] = useState<boolean>(false);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();

    const [state, dispatch] = useReducer((cur: ChatBoxState, payload: Partial<ChatBoxState>) => {
        return { ...cur, ...payload };
    }, initialState);

    const url = `/api/users/${userContext.userData.username}/message-groups/${groupID}/messages/all`;

    const messages = usePaginateData<{}, IMessage, PaginationResponse<IMessage>>(pageRef, cursor, url, page, setPage, {}, true);
    const selectedIndex = useArrowNavigation<MatchedMembers[number]>(suggestionsRef, inputRef, state.matchedMembers, 53, tagSuggestionHeight);
    const usersTyping = useUsersTyping(groupID);

    async function addMessageFiles(messageID: string): Promise<{
        failed: FailedUpload[],
        succeeded: IMessageFile[]
    }> {
        const failed: FailedUpload[] = [];
        const succeeded: IMessageFile[] = [];

        for (let i = 0; i < state.uploadedFiles.length; i++) {
            try {
                const resp = await axios.post<{ newFile: IMessageFile, message: string }>
                (`/api/users/${userContext.userData.username}/message-groups/${groupID}/messages/${messageID}/files`, {
                    file: state.uploadedFiles[i].base64Str,
                    name: state.uploadedFiles[i].file.name,
                    fileType: state.uploadedFiles[i].file.type,
                    fileSize: state.uploadedFiles[i].file.size
                });

                succeeded.push(resp.data.newFile);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                failed.push({
                    fileData: state.uploadedFiles[i], 
                    errorMessage: errorMessage
                });
            }
        }

        dispatch({ failedUploads: failed });
        return {
            failed: failed,
            succeeded: succeeded
        }
    }

    async function sendMessage(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (!inputRef.current || state.sendingMessage || !userContext.socket || 
            (inputRef.current.value === "" && state.uploadedFiles.length === 0)) {
            return;
        }

        try {
            const message = inputRef.current.value;
            dispatch({ sendingMessage: true });
            inputRef.current.value = "";
            
            addMessage({
                from: {
                    username: userContext.userData.username,
                    profilePicURL: userContext.userData.profilePicURL,
                    status: userContext.userData.status
                },
                files: state.uploadedFiles.map((x) => {
                    return {
                        url: "",
                        name: x.file.name,
                        fileType: x.file.type,
                        fileSize: x.file.size
                    }
                }),
                messageText: message,
                createdAt: new Date(),
                messageID: "",
                groupID: ""
            }, false);

            const resp = await axios.post<{ newMessage: IMessage, message: string }>
            (`/api/users/${userContext.userData.username}/message-groups/${groupID}/messages`, { 
                message: message 
            });

            const files = await addMessageFiles(resp.data.newMessage.messageID);
            if (files.failed.length === 0) {
                const newMessage = {
                    ...resp.data.newMessage,
                    files: files.succeeded
                };

                userContext.socket.emit("send-message", newMessage, groupID, userContext.userData.username, false, () => {
                    dispatch({ 
                        sendingMessage: false, 
                        newMessages: [newMessage, ...state.newMessages],
                        uploadedFiles: []
                    });
                });
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    const addMessage = useCallback((message: IMessage, updateMessage: boolean): void => {
        if (updateMessage) {
            dispatch({ newMessages: state.newMessages.map(x => {
                if (x.messageID !== message.messageID) return x;
                else return message;
            }) });
        } else {
            dispatch({ newMessages: [
                message, 
                ...state.newMessages
            ] });
        }
    }, [state.newMessages]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
        if ((e.key === "Enter" && !state.toggleTagSuggestions) || e.key === "ArrowLeft" 
            || e.key === "ArrowRight" || !inputRef.current) {
            dispatch({ toggleTagSuggestions: false });
            return;
        }

        if (e.key.length > 1 && e.key !== "Backspace") {
            e.preventDefault();
            return;
        }
        
        const pos = inputRef.current.selectionStart || 0;
        userContext.socket?.emit("typing-message", userContext.userData.username, groupID);

        if (e.key === "@" && (inputRef.current.value === "" || inputRef.current.value[pos - 1] === " ")) {
            dispatch({ toggleTagSuggestions: true });
            return;
        } else if (e.key === " ") {
            dispatch({ toggleTagSuggestions: false, tag: "" });
            return;
        } else if (e.key === "Backspace" && inputRef.current.value !== "" && inputRef.current.value[pos - 1] === "@"
            && (inputRef.current.value.length === 1 || inputRef.current.value[pos - 2] !== "@")) {
            dispatch({ toggleTagSuggestions: false });
            return;
        }

        if (state.toggleTagSuggestions) {
            if (e.key === "Backspace") {
                dispatch({ tag: state.tag.substring(0, state.tag.length - 1) });
            } else {
                dispatch({ tag: `${state.tag}${e.key}` });
            }
        }
    }

    function addEmoji(emoji: string): void {
        if (inputRef.current) {
            const pos = inputRef.current.selectionStart || 0;
            inputRef.current.value = inputRef.current.value.substring(0, pos) + emoji + inputRef.current.value.substring(pos);
            inputRef.current.focus();
            dispatch({ toggleEmojiPicker: false });
        }
    }

    function toggleEmojiPopUp(): void {
        if (state.toggleEmojiPicker) {
            dispatch({ toggleEmojiPicker: false });
            return;
        }

        dispatch({
            toggleEmojiPicker: true,
            toggleAttachFiles: false,
            toggleTagSuggestions: false
        });
    }

    function toggleAttachFilesPopUp(): void {
        if (state.toggleAttachFiles) {
            dispatch({ toggleAttachFiles: false });
            return;
        }

        dispatch({
            toggleAttachFiles: true,
            toggleEmojiPicker: false,
            toggleTagSuggestions: false
        });
    }

    const scrollToBottom = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.scrollTop = inputRef.current.scrollHeight;
        }
    }, []);

    const showMessage = useCallback((message: IMessage, id: string, from: string, updateMessage: boolean) => {
        if (id === groupID && from !== userContext.userData.username) {
            addMessage(message, updateMessage);
        }
    }, [groupID, addMessage, userContext.userData.username]);

    useEffect(() => {
        scrollToBottom();
    }, [state.newMessages, scrollToBottom]);

    useEffect(() => {
        userContext.socket?.on("receive-message", showMessage);
        return () => {
            userContext.socket?.off("receive-message", showMessage);
        }
    }, [userContext.socket, showMessage]);

    useEffect(() => {
        dispatch({ newMessages: messages.data })
    }, [messages.data]);

    return (
        <>
            <AnimatePresence>
                {toggleSupportedFormats && <SupportedFileFormats setToggleSupportedFormats={setToggleSupportedFormats} />}
                {errorMessage !== "" &&
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                />}
            </AnimatePresence>
            <Messages
                messages={state.newMessages}
                sendingMessage={state.sendingMessage}
                groupMembers={groupMembers}
                seller={seller}
                workType={workType}
                groupID={groupID}
                pageRef={pageRef}
            />
            <div className="pl-3 pt-3 flex-shrink-0 relative">
                <AnimatePresence>
                    {state.toggleEmojiPicker ?
                    <motion.div className="absolute bottom-[calc(100%-30px)] right-[14px] z-20 shadow-pop-up rounded-[8px]" 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
                        <EmojiPicker 
                            onEmojiClick={(data, _) => addEmoji(data.emoji)} 
                            lazyLoadEmojis={true}
                            searchDisabled={true}
                            height={300}
                            width={300}
                        />
                    </motion.div> :
                    state.toggleAttachFiles &&
                    <AttachFiles 
                        uploadedFiles={state.uploadedFiles}
                        dispatch={dispatch}
                        setErrorMessage={setErrorMessage}
                    />}
                    {state.toggleTagSuggestions &&
                    <TagSuggestions 
                        groupMembers={groupMembers} 
                        tag={state.tag}
                        inputRef={inputRef}
                        dispatch={dispatch}
                        matchedMembers={state.matchedMembers}
                        selectedTagIndex={selectedIndex}
                        suggestionsRef={suggestionsRef}
                    />}
                </AnimatePresence>
                <div className="mb-2">
                    <Typing 
                        usersTyping={usersTyping} 
                    />
                </div>
                <form className="search-bar w-full items-center" onSubmit={sendMessage}>
                    <input 
                        className="focus:outline-none placeholder-search-text bg-transparent mb-3 w-full"
                        placeholder="Send a message" 
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                        onFocus={() => dispatch({ 
                            toggleAttachFiles: false, 
                            toggleEmojiPicker: false,
                            toggleTagSuggestions: inputRef.current?.value !== undefined && 
                            inputRef.current.value[inputRef.current.value.length - 1] === "@"
                        })}
                    />
                    <div className="flex w-full justify-between items-end">
                        {state.uploadedFiles.length === 0 ? 
                        <p className="text-side-text-gray text-sm">
                            {`View supported file formats `}
                            <span className="text-main-blue text-sm underline cursor-pointer" onClick={() => setToggleSupportedFormats(true)}>
                                here
                            </span>
                        </p> : 
                        <div className="flex-grow flex flex-wrap gap-2 overflow-hidden">
                            {state.uploadedFiles.map((x: FileData, index: number) => {
                                return (
                                    <UploadedFile 
                                        fileData={x} 
                                        key={index}
                                        dispatch={dispatch}
                                        uploadedFiles={state.uploadedFiles}
                                    />
                                );
                            })}
                        </div>}
                        <div className="flex items-center flex-shrink-0">
                            <button onClick={toggleEmojiPopUp} type="button" className="ml-3">
                                <img 
                                    src={EmojiIcon} 
                                    className="[25px] h-[25px] cursor-pointer" 
                                    alt="" 
                                />
                            </button>
                            <button onClick={toggleAttachFilesPopUp} type="button" className="ml-3 mr-5">
                                <img 
                                    src={AttachIcon} 
                                    className="[25px] h-[25px] cursor-pointer" 
                                    alt="" 
                                />
                            </button>
                            <button type="submit" className="w-fit h-fit">
                                <img 
                                    src={SendIcon} 
                                    className="[25px] h-[25px] cursor-pointer" 
                                    alt="" 
                                />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ChatBox;
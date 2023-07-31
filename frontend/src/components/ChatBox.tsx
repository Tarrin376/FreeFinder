import { usePaginateData } from "../hooks/usePaginateData";
import { IMessage } from "../models/IMessage";
import { useState, useRef, useContext, useEffect, useCallback, useReducer } from "react";
import Message from "./Message";
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

interface ChatBoxProps {
    groupID: string,
    groupMembers: GroupPreview["members"]
}

export type ChatBoxState = {
    sendingMessage: boolean,
    newMessages: IMessage[],
    uploadedFiles: FileData[],
    failedUploads: FailedUpload[]
    toggleEmojiPicker: boolean,
    toggleAttachFiles: boolean,
    showTagSuggestions: boolean,
    tag: string
}

const initialState: ChatBoxState = {
    sendingMessage: false,
    newMessages: [],
    failedUploads: [],
    uploadedFiles: [],
    toggleEmojiPicker: false,
    toggleAttachFiles: false,
    showTagSuggestions: false,
    tag: ""
}

function ChatBox({ groupID, groupMembers }: ChatBoxProps) {
    const userContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const searchRef = useRef<HTMLInputElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();

    const url = `/api/users/${userContext.userData.username}/message-groups/${groupID}/messages/all`;
    const messages = usePaginateData<{}, IMessage, PaginationResponse<IMessage>>(pageRef, cursor, url, page, setPage, {}, true);
    const usersTyping = useUsersTyping(groupID);

    const [state, dispatch] = useReducer((cur: ChatBoxState, payload: Partial<ChatBoxState>) => {
        return { ...cur, ...payload };
    }, initialState);

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
        if (!searchRef.current || state.sendingMessage || !userContext.socket || searchRef.current.value === "") {
            return;
        }

        try {
            const message = searchRef.current.value;
            dispatch({ sendingMessage: true });
            searchRef.current.value = "";
            
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
                messageID: ""
            });

            const resp = await axios.post<{ newMessage: IMessage, sockets: string[], message: string }>
            (`/api/users/${userContext.userData.username}/message-groups/${groupID}/messages`, { 
                message: message 
            });

            const files = await addMessageFiles(resp.data.newMessage.messageID);
            if (files.failed.length === 0) {
                const newMessage = {
                    ...resp.data.newMessage,
                    files: files.succeeded
                };

                for (const socket of resp.data.sockets) {
                    userContext.socket.emit("send-message", newMessage, socket, groupID);
                }
                
                dispatch({ 
                    sendingMessage: false, 
                    newMessages: [newMessage, ...state.newMessages],
                    uploadedFiles: []
                });
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    const addMessage = useCallback((message: IMessage): void => {
        dispatch({ newMessages: [message, ...state.newMessages] });
    }, [state.newMessages]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
        userContext.socket?.emit("typing-message", userContext.userData.username, groupID);

        if (e.key === "@") {
            dispatch({ showTagSuggestions: true });
            return;
        } else if (e.key === " ") {
            dispatch({ showTagSuggestions: false, tag: "" });
            return;
        } else if (e.key === "Backspace" && searchRef.current?.value !== "" 
            && searchRef.current?.value[searchRef.current.value.length - 1] === "@") {
            dispatch({ showTagSuggestions: false });
            return;
        }

        if (state.showTagSuggestions) {
            if (e.key === "Backspace") {
                dispatch({ tag: state.tag.substring(0, state.tag.length - 1) });
            } else {
                dispatch({ tag: `${state.tag}${e.key}` });
            }
        }
    }

    function addEmoji(emoji: string): void {
        if (searchRef.current) {
            searchRef.current.value += emoji;
            searchRef.current.focus();
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
            showTagSuggestions: false
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
            showTagSuggestions: false
        });
    }

    const scrollToBottom = useCallback(() => {
        if (searchRef.current) {
            searchRef.current.scrollTop = searchRef.current.scrollHeight;
        }
    }, []);

    const showMessage = useCallback((message: IMessage, id: string) => {
        if (id === groupID && message.from.username !== userContext.userData.username) {
            addMessage(message);
        }
    }, [groupID, userContext.userData.username, addMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [state.newMessages, scrollToBottom]);

    useEffect(() => {
        userContext.socket?.on("receive-message", showMessage);
        return () => {
            userContext.socket?.off("receive-message", showMessage);
        }
    }, [userContext.socket, showMessage]);

    return (
        <>
            <AnimatePresence>
                {errorMessage !== "" &&
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                />}
            </AnimatePresence>
            <div className="bg-transparent flex-grow overflow-y-scroll w-full flex flex-col-reverse items-end gap-6 p-4" ref={pageRef}>
                {[...state.newMessages, ...messages.data].map((message: IMessage, index: number) => {
                    return (
                        <Message
                            message={message}
                            key={index}
                            isLastMessage={index === 0}
                            sendingMessage={state.sendingMessage}
                            groupMembers={groupMembers}
                        />
                    )
                })}
            </div>
            <div className="pl-3 pt-3 flex-shrink-0 relative">
                <AnimatePresence>
                    {state.toggleEmojiPicker ?
                    <motion.div className="absolute bottom-[calc(100%-30px)] right-[14px] z-20 shadow-pop-up rounded-[8px]" 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
                        <EmojiPicker 
                            onEmojiClick={(data, _) => addEmoji(data.emoji)} 
                            lazyLoadEmojis={true}
                            emojiStyle={EmojiStyle.GOOGLE}
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
                    {state.showTagSuggestions &&
                    <TagSuggestions 
                        groupMembers={groupMembers} 
                        tag={state.tag}
                        searchRef={searchRef}
                        dispatch={dispatch}
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
                        ref={searchRef}
                        onKeyDown={handleKeyDown}
                        onFocus={() => dispatch({ 
                            toggleAttachFiles: false, 
                            toggleEmojiPicker: false 
                        })}
                    />
                    <div className="flex w-full justify-between items-end">
                        {state.uploadedFiles.length === 0 ? 
                        <p className="text-side-text-gray text-sm">
                            {`View list of supported file formats `}
                            <span className="text-main-blue text-sm underline cursor-pointer">
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
                            <button onClick={toggleEmojiPopUp} type="button">
                                <img 
                                    src={EmojiIcon} 
                                    className="[23px] h-[23px] ml-3 cursor-pointer" 
                                    alt="" 
                                />
                            </button>
                            <button onClick={toggleAttachFilesPopUp} type="button">
                                <img 
                                    src={AttachIcon} 
                                    className="[23px] h-[23px] ml-3 mr-5 cursor-pointer" 
                                    alt="" 
                                />
                            </button>
                            <button 
                                className="w-[23px] h-[23px] cursor-pointer" 
                                type="submit"
                                style={{ backgroundImage: `url('${SendIcon}')`, backgroundSize: "contain" }}>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ChatBox;
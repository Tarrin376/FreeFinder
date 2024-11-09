import { usePaginateData } from "../../../hooks/usePaginateData";
import { IMessage } from "../../../models/IMessage";
import { useState, useRef, useContext, useEffect, useCallback, useReducer } from "react";
import { UserContext } from "../../../providers/UserProvider";
import { getAPIErrorMessage } from "../../../utils/getAPIErrorMessage";
import axios, { AxiosError } from "axios";
import SendIcon from "../../../assets/send.png";
import { AnimatePresence } from "framer-motion";
import ErrorPopUp from "../../../components/Error/ErrorPopUp";
import { PaginationResponse } from "../../../types/PaginateResponse";
import UsersTyping from "../../../components/UsersTyping";
import AttachIcon from "../../../assets/attach.png";
import EmojiIcon from "../../../assets/emoji.png";
import EmojiPicker from "emoji-picker-react";
import { motion } from "framer-motion";
import AttachFiles from "../../../components/File/AttachFiles";
import UploadedFiles from "../../../components/File/UploadedFiles";
import { GroupPreview } from "../../../types/GroupPreview";
import TagSuggestions from "../../../components/TagSuggestions";
import { FailedUpload } from "../../../types/FailedUpload";
import { IMessageFile } from "../../../models/IMessageFile";
import SupportedFileFormats from "../../../components/File/SupportedFileFormats";
import { MatchedMembers } from "../../../types/MatchedMembers";
import { useArrowNavigation } from "../../../hooks/useArrowNavigation";
import { FoundUsers } from "../../../types/FoundUsers";
import Messages from "../../../components/Message/Messages";
import { SendNotification } from "src/types/SendNotification";
import { useWindowSize } from "src/hooks/useWindowSize";
import { MIN_DUAL_WIDTH } from "../LiveChat";
import { compressImage } from "src/utils/compressImage";
import { ChatBoxState } from "../../../types/ChatBoxState";

interface ChatBoxProps {
    seller: FoundUsers[number],
    workType: string,
    groupID: string,
    groupMembers: GroupPreview["members"]
}

const INITIAL_STATE: ChatBoxState = {
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

export const TAG_SUGGESTIONS_HEIGHT = 273;

function ChatBox({ seller, workType, groupID, groupMembers }: ChatBoxProps) {
    const userContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [page, setPage] = useState<{ value: number }>({ value: 1 });

    const [toggleSupportedFormats, setToggleSupportedFormats] = useState<boolean>(false);
    const url = `/api/users/${userContext.userData.username}/message-groups/${groupID}/messages/all`;
    
    const inputRef = useRef<HTMLInputElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();

    const [state, dispatch] = useReducer((cur: ChatBoxState, payload: Partial<ChatBoxState>) => {
        return { ...cur, ...payload };
    }, INITIAL_STATE);

    const messages = usePaginateData<{}, IMessage, PaginationResponse<IMessage>>(pageRef, cursor, url, page, setPage, {}, true);
    const selectedIndex = useArrowNavigation<MatchedMembers[number]>(suggestionsRef, inputRef, state.matchedMembers, 53, TAG_SUGGESTIONS_HEIGHT);
    const windowSize = useWindowSize();

    async function addMessageFiles(messageID: string): Promise<{ failed: FailedUpload[], succeeded: IMessageFile[] }> {
        const failed: FailedUpload[] = [];
        const succeeded: IMessageFile[] = [];

        for (const uploadedFile of state.uploadedFiles) {
            try {
                const compressed = uploadedFile.type.startsWith("/image") ? await compressImage(uploadedFile) : uploadedFile;
                const formData = new FormData();
                formData.append("file", compressed);

                const resp = await axios.post<{ file: IMessageFile, message: string }>
                (`/api/users/${userContext.userData.username}/message-groups/${groupID}/messages/${messageID}/files`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                succeeded.push(resp.data.file);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                failed.push({
                    file: uploadedFile, 
                    errorMessage: errorMessage
                });
            }
        }

        dispatch({ failedUploads: failed });
        return {
            failed: failed,
            succeeded: succeeded
        };
    }

    function createMessage(message: string): IMessage {
        return {
            from: {
                username: userContext.userData.username,
                profilePicURL: userContext.userData.profilePicURL,
                status: userContext.userData.status
            },
            files: state.uploadedFiles.map((x) => {
                return {
                    url: "",
                    name: x.name,
                    fileType: x.type,
                    fileSize: x.size
                };
            }),
            messageText: message,
            createdAt: new Date(),
            messageID: "",
            groupID: ""
        };
    }

    function notifyGroupMembers(sockets: string[], mentioned: SendNotification[], newMessage: IMessage): void {
        for (const socket of sockets) {
            userContext.socket?.emit("send-message", newMessage, groupID, userContext.userData.username, socket);
        }

        for (const mention of mentioned) {
            userContext.socket?.emit("send-notification", mention.notification, mention.socketID);
        }
    }

    async function sendMessage(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (!inputRef.current || state.sendingMessage || (inputRef.current.value === "")) {
            return;
        }

        try {
            const message = inputRef.current.value;
            dispatch({ sendingMessage: true });

            inputRef.current.value = "";
            addMessage(createMessage(message), false);

            const resp = await axios.post<{ newMessage: IMessage, sockets: string[], mentioned: SendNotification[], message: string }>
            (`/api/users/${userContext.userData.username}/message-groups/${groupID}/messages`, { 
                message: message 
            });

            const files = await addMessageFiles(resp.data.newMessage.messageID);
            if (files.failed.length > 0) {
                setErrorMessage(`Failed to upload ${files.failed.length} ${files.failed.length === 1 ? "file" : "files"}. 
                Please verify that ${files.failed.length === 1 ? "the file format is supported" : "the file formats are supported"}.`);
            }

            const newMessage = {
                ...resp.data.newMessage,
                files: files.succeeded
            };

            notifyGroupMembers(resp.data.sockets, resp.data.mentioned, newMessage);
            dispatch({ 
                sendingMessage: false, 
                newMessages: [newMessage, ...state.newMessages],
                uploadedFiles: []
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
        if ((e.key === "Enter" && !state.toggleTagSuggestions) || e.key === "ArrowLeft" || e.key === "ArrowRight" || !inputRef.current) {
            dispatch({ toggleTagSuggestions: false });
            return;
        }

        if (e.key.length > 1 && e.key !== "Backspace") {
            e.preventDefault();
            return;
        }
        
        const cursorPosition = inputRef.current.selectionStart || 0;
        userContext.socket?.emit("typing-message", userContext.userData.username, groupID);

        if (e.key === "@" && (inputRef.current.value === "" || inputRef.current.value[cursorPosition - 1] === " ")) {
            dispatch({ toggleTagSuggestions: true });
            return;
        } else if (e.key === " ") {
            dispatch({ toggleTagSuggestions: false, tag: "" });
            return;
        } else if (e.key === "Backspace" && inputRef.current.value !== "" && inputRef.current.value[cursorPosition - 1] === "@"
            && (inputRef.current.value.length === 1 || inputRef.current.value[cursorPosition - 2] !== "@")) {
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

    function removeFile(file: File): void {
        dispatch({ uploadedFiles: state.uploadedFiles.filter((x: File) => x !== file) });
    }

    const addMessage = useCallback((message: IMessage, updateMessage: boolean): void => {
        if (updateMessage) {
            dispatch({ 
                newMessages: state.newMessages.map(x => {
                    if (x.messageID !== message.messageID) return x;
                    else return message;
                }) 
            });
        } else {
            dispatch({ 
                newMessages: [
                    message, 
                    ...state.newMessages
                ] 
            });
        }
    }, [state.newMessages]);

    const showMessage = useCallback((message: IMessage, id: string, from: string, updateMessage: boolean) => {
        if (id === groupID && from !== userContext.userData.username) {
            addMessage(message, updateMessage);
        }
    }, [groupID, addMessage, userContext.userData.username]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.scrollTop = inputRef.current.scrollHeight;
        }
    }, [state.newMessages]);

    useEffect(() => {
        userContext.socket?.on("receive-message", showMessage);
        
        return () => {
            userContext.socket?.off("receive-message", showMessage);
        }
    }, [userContext.socket, showMessage]);

    useEffect(() => {
        dispatch({ newMessages: messages.data });
    }, [messages.data]);

    return (
        <div className="flex-grow flex flex-col min-h-0">
            <AnimatePresence>
                {toggleSupportedFormats && <SupportedFileFormats setToggleSupportedFormats={setToggleSupportedFormats} />}
                {errorMessage !== "" &&
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                />}
            </AnimatePresence>
            <div className={`flex-grow overflow-y-scroll bg-transparent w-full flex flex-col-reverse items-end gap-6 
            ${windowSize >= MIN_DUAL_WIDTH ? "p-4" : "py-4 pr-[8px]"}`} ref={pageRef}>
                <Messages
                    messages={state.newMessages}
                    sendingMessage={state.sendingMessage}
                    groupMembers={groupMembers}
                    seller={seller}
                    workType={workType}
                    groupID={groupID}
                />
            </div>
            <div className={`${windowSize >= MIN_DUAL_WIDTH ? "pl-4" : ""} pt-2 flex-shrink-0 relative`}>
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
                        updateUploadedFiles={(files) => dispatch({ uploadedFiles: files })}
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
                <UsersTyping groupID={groupID} styles="mb-2" />
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
                        <div>
                            {state.uploadedFiles.length > 0 &&
                            <UploadedFiles
                                uploadedFiles={state.uploadedFiles}
                                removeFile={removeFile}
                            />}
                            <p className="text-main-blue text-sm cursor-pointer underline" 
                            onClick={() => setToggleSupportedFormats(true)}>
                                Supported formats
                            </p>
                        </div>
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
        </div>
    )
}

export default ChatBox;
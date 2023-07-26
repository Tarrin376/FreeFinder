import { usePaginateData } from "../hooks/usePaginateData";
import { IMessage } from "../models/IMessage";
import { useState, useRef, useContext, useEffect, useCallback } from "react";
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
import EmojiPicker from "emoji-picker-react";
import { motion } from "framer-motion";

interface ChatBoxProps {
    groupID: string
}

function ChatBox({ groupID }: ChatBoxProps) {
    const userContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [sendingMessage, setSendingMessage] = useState<boolean>(false);
    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const searchRef = useRef<HTMLInputElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();

    const url = `/api/users/${userContext.userData.username}/message-groups/${groupID}/all`;
    const messages = usePaginateData<{}, IMessage, PaginationResponse<IMessage>>(pageRef, cursor, url, page, setPage, {}, true);
    const [newMessages, setNewMessages] = useState<IMessage[]>([]);
    const [toggleEmojiPicker, setToggleEmojiPicker] = useState<boolean>(false);
    const usersTyping = useUsersTyping(groupID);

    async function sendMessage(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (!searchRef.current || sendingMessage || !userContext.socket || searchRef.current.value === "") {
            return;
        }

        try {
            setSendingMessage(true);
            const message = searchRef.current.value;
            const resp = await axios.post<{ newMessage: IMessage, message: string }>
            (`/api/users/${userContext.userData.username}/message-groups/${groupID}`, { 
                message: message 
            });
            
            userContext.socket.emit("send-message", resp.data.newMessage, groupID);
            addMessage(resp.data.newMessage);
            searchRef.current.value = "";
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            setSendingMessage(false);
        }
    }

    function addMessage(message: IMessage) {
        setNewMessages((cur) => [message, ...cur]);
    }

    function typingMessage() {
        userContext.socket?.emit("typing-message", userContext.userData.username, groupID);
    }

    function addEmoji(emoji: string): void {
        if (searchRef.current) {
            searchRef.current.value += emoji;
            setToggleEmojiPicker(false);
        }
    }

    const scrollToBottom = useCallback(() => {
        if (searchRef.current) {
            searchRef.current.scrollTop = searchRef.current.scrollHeight;
        }
    }, []);

    const showMessage = useCallback((message: IMessage, id: string) => {
        if (id === groupID) {
            addMessage(message);
        }
    }, [groupID]);

    useEffect(() => {
        scrollToBottom();
    }, [newMessages, scrollToBottom]);

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
            <div className="bg-transparent flex-grow overflow-y-scroll w-full flex flex-col-reverse items-end gap-6 p-6" ref={pageRef}>
                {[...newMessages, ...messages.data].map((message: IMessage, index: number) => {
                    return (
                        <Message
                            message={message}
                            key={index}
                        />
                    )
                })}
            </div>
            <div className="p-3 pb-0 flex-shrink-0 relative">
                <AnimatePresence>
                    {toggleEmojiPicker &&
                    <motion.div className="absolute bottom-[55px] right-[14px] z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
                        <EmojiPicker 
                            onEmojiClick={(data, _) => addEmoji(data.emoji)} 
                            lazyLoadEmojis={true}
                        />
                    </motion.div>}
                </AnimatePresence>
                <div className="mb-1">
                    <Typing usersTyping={usersTyping} />
                </div>
                <form className="search-bar flex w-full items-center" onSubmit={sendMessage}>
                    <input 
                        type="text"
                        className="focus:outline-none placeholder-search-text bg-transparent flex-grow"
                        placeholder="Send a message" 
                        ref={searchRef}
                        onKeyDown={typingMessage}
                    />
                    <img 
                        src={EmojiIcon} 
                        className="[23px] h-[23px] ml-3 cursor-pointer" 
                        onClick={() => setToggleEmojiPicker((cur) => !cur)}
                        alt="" 
                    />
                    <img 
                        src={AttachIcon} 
                        className="[23px] h-[23px] ml-3 mr-5 cursor-pointer" 
                        alt="" 
                    />
                    <button className="w-[23px] h-[23px] cursor-pointer" type="submit"
                    style={{ backgroundImage: `url('${SendIcon}')`, backgroundSize: "contain" }}>
                    </button>
                </form>
            </div>
        </>
    )
}

export default ChatBox;
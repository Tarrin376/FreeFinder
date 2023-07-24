import SendIcon from "../assets/send.png";
import { useEffect, useRef, useState, useContext } from "react";
import { usePaginateData } from "../hooks/usePaginateData";
import { IMessage } from "../models/IMessage";
import { MessagesResponse } from "../types/MessagesResponse";
import { UserContext } from "../providers/UserContext";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import ActionsIcon from "../assets/actions.png";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import axios, { AxiosError } from "axios";
import ErrorPopUp from "./ErrorPopUp";
import { AnimatePresence } from "framer-motion";

interface ChatProps {
    groupID: string
}

const visibleMembers = 3;

function Chat({ groupID }: ChatProps) {
    const userContext = useContext(UserContext);
    const [page, setPage] = useState<{ value: number }>({ value: 1 });
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [sendingMessage, setSendingMessage] = useState<boolean>(false);

    const searchRef = useRef<HTMLInputElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);
    const cursor = useRef<string>();

    const url = `/api/users/${userContext.userData.username}/message-groups/${groupID}/all`;
    const messages = usePaginateData<{}, IMessage, MessagesResponse<IMessage>>(pageRef, cursor, url, page, setPage, {});

    async function sendMessage(e: React.FormEvent<HTMLDivElement>): Promise<void> {
        e.preventDefault();
        if (!searchRef.current || sendingMessage) {
            return;
        }

        try {
            setSendingMessage(true);
            const message = searchRef.current.value;
            await axios.post<{ message: string }>(`/api/users/${userContext.userData.username}/message-groups/${groupID}`, { 
                message: message 
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            setSendingMessage(false);
        }
    }

    useEffect(() => {
        messages.resetState();
    }, [groupID]);

    if (messages.loading || !messages.meta) {
        return <p>loading</p>
    }

    return (
        <div className="flex-grow overflow-hidden flex flex-col" onSubmit={sendMessage}>
            {errorMessage !== "" &&
            <AnimatePresence>
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                />
            </AnimatePresence>}
            <div className="border-b border-light-border-gray bg-transparent pl-6 h-[100px] w-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <ProfilePicAndStatus
                        profilePicURL=""
                        size={50}
                        username={messages.meta.groupName}
                        statusStyles="before:hidden"
                    />
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="text-[20px]">{messages.meta.groupName}</p>
                            <button className="change">Change</button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="inline-flex">
                        {messages.meta.members.slice(0, visibleMembers).map((member, index) => {
                            return (
                                <ProfilePicAndStatus
                                    profilePicURL={member.user.profilePicURL}
                                    size={45}
                                    username={member.user.username}
                                    statusStyles="ml-[-13px] before:hidden"
                                    imgStyles="outline outline-[3px] outline-main-white"
                                    key={index}
                                />
                            )
                        })}
                        {messages.meta.members.length > visibleMembers &&
                        <div className="w-[45px] h-[45px] rounded-full outline outline-[3px] outline-main-white 
                        bg-very-light-gray flex items-center justify-center ml-[-13px] cursor-pointer">
                            <p className="text-[18px] text-side-text-gray">
                                {`+${messages.meta.members.length - visibleMembers}`}
                            </p>
                        </div>}
                    </div>
                    <img src={ActionsIcon} className="w-[27px] h-[27px]" alt="" />
                </div>
            </div>
            <div className="bg-[#f6f6f8] flex-grow w-full overflow-y-scroll scrollbar-hide" ref={pageRef}>

            </div>
            <div className="p-3 pb-0">
                <form className="search-bar flex w-full">
                    <input 
                        type="text"
                        className="focus:outline-none placeholder-search-text bg-transparent flex-grow"
                        placeholder="Send a message" 
                        ref={searchRef}
                    />
                    <button className="w-[23px] h-[23px] cursor-pointer" type="submit"
                    style={{ backgroundImage: `url('${SendIcon}')`, backgroundSize: "contain" }}>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Chat;
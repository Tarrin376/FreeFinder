import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../providers/UserContext";
import SendIcon from "../assets/send.png";
import AllMessagesIcon from "../assets/AllMessages.png";
import AddGroupIcon from "../assets/AddGroup.png";
import CreateGroup from "./CreateGroup";
import { AnimatePresence } from "framer-motion";

interface MessagesProps {
    setMessagesPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

function Messages({ setMessagesPopUp }: MessagesProps) {
    const userContext = useContext(UserContext);
    const [createGroupPopUp, setCreateGroupPopUp] = useState<boolean>(false);

    function openCreateGroupPopUp() {
        setCreateGroupPopUp(true);
    }

    useEffect(() => {
        if (userContext.socket) {
            userContext.socket.emit("message", () => console.log("hello there"));
        }
    }, [userContext]);

    return (
        <PopUpWrapper setIsOpen={setMessagesPopUp} title="Messages" styles="!max-w-[1000px] h-[1000px]">
            <AnimatePresence>
                {createGroupPopUp && 
                <CreateGroup 
                    setCreateGroupPopUp={setCreateGroupPopUp} 
                />}
            </AnimatePresence>
            <div className="flex flex-1 gap-3">
                <div className="bg-transparent rounded-[8px] overflow-y-scroll scrollbar-hide w-[330px]">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <img src={AllMessagesIcon} className="w-[16px] h-[16px]" alt="" />
                            <p className="text-side-text-gray text-[15px]">All messages</p>
                        </div>
                        <img 
                            src={AddGroupIcon} 
                            className="w-[25px] h-[25px] cursor-pointer" 
                            onClick={openCreateGroupPopUp}
                            alt="" 
                        />
                    </div>
                </div>
                <div className="flex-grow rounded-[8px] overflow-hidden flex flex-col gap-4">
                    <div className="border border-light-border-gray bg-transparent p-6 h-[100px] rounded-[8px] w-full">

                    </div>
                    <div className="bg-[#f6f6f8] flex-grow w-full rounded-[8px]">

                    </div>
                    <div className="search-bar flex w-full">
                        <input 
                            type="text"
                            className="focus:outline-none placeholder-search-text bg-transparent flex-grow"
                            placeholder="Send a message" 
                        />
                        <img 
                            src={SendIcon} 
                            className="w-[23px] h-[23px] cursor-pointer" 
                            alt="Send" 
                        />
                    </div>
                </div>
            </div>
        </PopUpWrapper>
    )
}

export default Messages;
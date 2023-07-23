import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import { FoundUsers } from "../types/FoundUsers";
import CloseSvg from "./CloseSvg";
import AddIcon from "../assets/add.png";
import UserSkeleton from "../skeletons/UserSkeleton";
import HighlightedSubstring from "./HighlightedSubstring";

interface CreateGroupProps {
    setCreateGroupPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    seller?: FoundUsers[number],
    initialServiceID?: string
}

const limit = 3;

function CreateGroup({ setCreateGroupPopUp, seller, initialServiceID }: CreateGroupProps) {
    const [userSearch, setUserSearch] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [addedUsers, setAddedUsers] = useState<FoundUsers>(seller ? [seller] : []);
    const [groupName, setGroupName] = useState<string>("");
    const [serviceID, setServiceID] = useState<string>(initialServiceID ?? "");
    const [loading, setLoading] = useState<boolean>(false);
    const foundUsers = useFetchUsers(userSearch, limit, setErrorMessage, setLoading);

    function addUser(user: FoundUsers[number]): void {
        setAddedUsers((cur) => [...cur, user]);
    }

    function removeUser(username: string): void {
        setAddedUsers((cur) => cur.filter((user) => user.username !== username));
    }

    return (
        <PopUpWrapper setIsOpen={setCreateGroupPopUp} title="Create new message group">
            {errorMessage !== "" && 
            <ErrorMessage 
                message={errorMessage} 
                setErrorMessage={setErrorMessage} 
                title="Uh oh! Something went wrong."
            />}
            <p className="mb-2">Service ID</p>
            <input 
                type="text" 
                className="search-bar mb-4"
                placeholder="Enter service ID"
                value={serviceID}
                onChange={(e) => setServiceID(e.target.value)}
            />
            <p className="mb-2">Group Name</p>
            <input 
                type="text" 
                className="search-bar mb-4"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
            />
            <p className="mb-2">Add People</p>
            {addedUsers.length > 0 &&
            <div className="flex gap-3 flex-wrap mb-3">
                {addedUsers.map((user: FoundUsers[number], index: number) => {
                    return (
                        <div className="w-fit h-fit relative">
                            <ProfilePicAndStatus
                                profilePicURL={user.profilePicURL}
                                profileStatus={user.status}
                                statusStyles="before:hidden"
                                username={user.username}
                                size={48}
                            />
                            {(index > 0 || !seller) &&
                            <div className="bg-error-text text-main-white rounded-full w-[18px] h-[18px] border-2 border-main-white
                            absolute top-[33px] left-[30px] flex items-center justify-center cursor-pointer"
                            onClick={() => removeUser(user.username)}>
                                <CloseSvg 
                                    size="12px"
                                    colour="#fdfdfd" 
                                />
                            </div>}
                        </div>
                    )
                })}
            </div>}
            <input 
                type="text" 
                className={`search-bar focus:outline-none ${userSearch !== "" ? "rounded-b-none" : ""}`}
                placeholder="Search user list"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
            />
            {userSearch.trim() !== "" &&
            <div className="border-b border-x border-light-border-gray rounded-b-[8px] 
            overflow-y-scroll p-4 bg-main-white flex flex-col gap-3">
                {!loading ? foundUsers.map((user) => {
                    return (
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <ProfilePicAndStatus
                                    profilePicURL={user.profilePicURL}
                                    profileStatus={user.status}
                                    statusStyles="before:hidden"
                                    username={user.username}
                                    size={41}
                                />
                                <HighlightedSubstring
                                    word={user.username}
                                    substring={userSearch}
                                    foundAt={user.username.toLowerCase().indexOf(userSearch.toLowerCase())}
                                    styles="hover:!px-0"
                                />
                            </div>
                            <button className={`side-btn w-fit !h-[33px] ${addedUsers.includes(user) ? 
                            "!bg-light-green !text-main-white !border-light-green pointer-events-none" : ""}`}
                            onClick={() => addUser(user)}>
                                {addedUsers.includes(user) ? "Added" : "Add"}
                            </button>
                        </div>
                    )
                }) : new Array(limit).fill(0).map((_, index: number) => <UserSkeleton key={index} />)}
            </div>}
            <button className={`main-btn items-center justify-center gap-2 ${addedUsers.length === 0 ? "invalid-button" : ""} mt-7`}>
                <img src={AddIcon} alt="" className="w-[16px] h-[16px]" />
                Create new group
            </button>
        </PopUpWrapper>
    )
}

export default CreateGroup;
import { FoundUsers } from "../types/FoundUsers";
import { useFetchUsers } from "../hooks/useFetchUsers";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import CloseSvg from "./CloseSvg";
import HighlightedSubstring from "./HighlightedSubstring";
import { useContext, useState } from "react";
import { UserContext } from "../providers/UserContext";
import UserSkeleton from "../skeletons/UserSkeleton";
import { GroupPreview } from "../types/GroupPreview";

interface AddPeopleProps {
    groupMembers?: GroupPreview["members"],
    addedUsers: FoundUsers,
    setAddedUsers: React.Dispatch<React.SetStateAction<FoundUsers>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
}

const limit = 3;

function AddPeople({ groupMembers, addedUsers, setAddedUsers, setErrorMessage }: AddPeopleProps) {
    const [userSearch, setUserSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const foundUsers = useFetchUsers(userSearch, limit, setErrorMessage, setLoading);
    const userContext = useContext(UserContext);

    function addUser(user: FoundUsers[number]): void {
        setAddedUsers((cur) => [...cur, user]);
    }

    function removeUser(username: string): void {
        setAddedUsers((cur) => cur.filter((user) => user.username !== username));
    }

    return (
        <>
            <p className="mb-2">Add People</p>
            {addedUsers.length > 0 &&
            <div className="flex gap-3 flex-wrap mb-3">
                {addedUsers.map((user: FoundUsers[number], index: number) => {
                    return (
                        <div className="w-fit h-fit relative" key={index}>
                            <ProfilePicAndStatus
                                profilePicURL={user.profilePicURL}
                                profileStatus={user.status}
                                statusStyles="before:hidden"
                                username={user.username}
                                size={48}
                            />
                            {index > 0 &&
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
                {!loading ? foundUsers.filter((user: FoundUsers[number]) => user.username !== userContext.userData.username)
                .map((user: FoundUsers[number], index: number) => {
                    const added = addedUsers.find((x) => x.username === user.username) !== undefined;
                    const isMember = groupMembers && groupMembers.find((x) => x.user.username === user.username) !== undefined;

                    return (
                        <div className="flex justify-between items-center gap-[8px]" key={index}>
                            <div className="flex items-center gap-3 overflow-hidden">
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
                            <button className={`side-btn text-[15px] rounded-[6px] w-fit !h-[30px] ${added || isMember ? 
                            `!bg-light-green !text-main-white !border-light-green pointer-events-none` : ""}`}
                            onClick={() => addUser(user)}>
                                {added || isMember ? "Added" : "Add"}
                            </button>
                        </div>
                    )
                }) : new Array(limit).fill(0).map((_, index: number) => <UserSkeleton key={index} />)}
            </div>}
        </>
    )
}

export default AddPeople;
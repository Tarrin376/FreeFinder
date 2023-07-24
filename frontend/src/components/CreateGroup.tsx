import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useState, useContext } from "react";
import ErrorMessage from "./ErrorMessage";
import ProfilePicAndStatus from "./ProfilePicAndStatus";
import CloseSvg from "./CloseSvg";
import AddIcon from "../assets/add.png";
import UserSkeleton from "../skeletons/UserSkeleton";
import HighlightedSubstring from "./HighlightedSubstring";
import axios, { AxiosError } from "axios";
import { FoundUsers } from "../types/FoundUsers";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import Button from "./Button";
import { UserContext } from "../providers/UserContext";

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
    const [findSellerBtn, setFindSellerBtn] = useState<boolean>(false);
    const foundUsers = useFetchUsers(userSearch, limit, setErrorMessage, setLoading);
    const userContext = useContext(UserContext);

    function addUser(user: FoundUsers[number]): void {
        setAddedUsers((cur) => [...cur, user]);
    }

    function removeUser(username: string): void {
        setAddedUsers((cur) => cur.filter((user) => user.username !== username));
    }

    function updateServiceID(e: React.ChangeEvent<HTMLInputElement>): void {
        const id = e.target.value;
        setServiceID(id);
        setFindSellerBtn(true);
    }

    function validInputs() {
        return addedUsers.length > 0 && groupName !== "" && serviceID !== "" && !findSellerBtn;
    }

    async function findSeller(): Promise<string | undefined> {
        try {
            const resp = await axios.get<{ sellerSummary: FoundUsers[number], message: string }>(`/api/posts/${serviceID}/seller-summary`);
            setAddedUsers((cur) => [resp.data.sellerSummary, ...cur.filter((user) => user.username !== resp.data.sellerSummary.username)]);
            setFindSellerBtn(false);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    async function createNewGroup(): Promise<string | undefined> {
        try {
            await axios.post<{ message: string }>(`/api/users/${userContext.userData.username}/message-groups`, {
                members: addedUsers.map((user) => user.username),
                groupName: groupName,
                postID: serviceID
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
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
                className="search-bar"
                placeholder="Enter service ID"
                value={serviceID}
                onChange={updateServiceID}
                disabled={initialServiceID !== undefined}
            />
            {findSellerBtn && serviceID !== "" &&
            <Button
                action={findSeller}
                completedText="Found seller"
                defaultText="Find seller"
                loadingText="Finding seller"
                styles="side-btn !h-[33px] mt-3"
                textStyles="text-main-blue"
                setErrorMessage={setErrorMessage}
                loadingSvgSize="20px"
                loadingSvgColour="#4E73F8"
            />}
            <p className="mb-2 mt-4">Group Name</p>
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
                {!loading ? foundUsers.map((user: FoundUsers[number], index: number) => {
                    const added = addedUsers.find((x) => x.username === user.username) !== undefined;
                    return (
                        <div className="flex justify-between items-center" key={index}>
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
                            <button className={`side-btn w-fit !h-[33px] ${added ? `!bg-light-green !text-main-white 
                            !border-light-green pointer-events-none` : ""}`}
                            onClick={() => addUser(user)}>
                                {added ? "Added" : "Add"}
                            </button>
                        </div>
                    )
                }) : new Array(limit).fill(0).map((_, index: number) => <UserSkeleton key={index} />)}
            </div>}
            <Button
                action={createNewGroup}
                completedText="Group created"
                defaultText="Create new group"
                loadingText="Creating group"
                styles={`main-btn items-center justify-center gap-2 ${!validInputs() ? "invalid-button" : ""} mt-7`}
                textStyles="text-main-white"
                setErrorMessage={setErrorMessage}
                loadingSvgSize="28px"
                whenComplete={() => setCreateGroupPopUp(false)}
            >
                <img src={AddIcon} alt="" className="w-[16px] h-[16px]" />
            </Button>
        </PopUpWrapper>
    )
}

export default CreateGroup;
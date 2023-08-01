import ProfilePicAndStatus from "./ProfilePicAndStatus";
import HighlightedSubstring from "./HighlightedSubstring";
import { sellerLevelTextStyles } from "../utils/sellerLevelTextStyles";
import { SellerOptions } from "../enums/SellerOptions";
import SaveSeller from "./SaveSeller";
import axios, { AxiosError } from "axios";
import { UserContext } from "../providers/UserContext";
import { useContext, useState } from "react";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import Button from "./Button";
import { useWindowSize } from "../hooks/useWindowSize";
import ErrorPopUp from "./ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import { UserStatus } from "../enums/UserStatus";

interface SellerProps {
    navigateToProfile: () => void,
    profilePicURL: string,
    profilePicSize: number,
    status: UserStatus,
    username: string,
    searchQuery: string,
    sellerLevel: string,
    summary: string,
    country: string,
    sellerID: string,
    canRemove?: {
        count: React.MutableRefObject<number>,
        deletingSeller: boolean,
        setDeletingSeller: React.Dispatch<React.SetStateAction<boolean>>
    }
    imgStyles?: string,
    statusStyles?: string,
    option?: SellerOptions
}

function Seller(props: SellerProps) {
    const userContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [hide, setHide] = useState<boolean>(false);
    const windowSize = useWindowSize();

    async function removeSavedSeller(saved: boolean): Promise<void> {
        if (!props.canRemove || props.canRemove.deletingSeller) {
            return;
        }

        try {
            props.canRemove.setDeletingSeller(true);
            await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}/saved/sellers/${props.sellerID}`);
            props.canRemove.count.current -= 1;
            setHide(true);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            props.canRemove.setDeletingSeller(false);
        }
    }
    
    if (hide) {
        return <></>
    }

    return (
        <div className="flex items-start justify-between gap-[8px]">
            <div className="flex justify-between items-start w-full pr-9">
                <div className="flex items-center gap-3 rounded-[6px] transition-all ease-out duration-100 flex-grow overflow-hidden">
                    {windowSize > 400 &&
                    <div className="relative">
                        <ProfilePicAndStatus
                            profilePicURL={props.profilePicURL}
                            profileStatus={props.status}
                            statusStyles={props.statusStyles}
                            imgStyles={`${props.imgStyles} cursor-pointer`}
                            size={props.profilePicSize}
                            username={props.username}
                            action={props.navigateToProfile}
                        />
                    </div>}
                    <div className="flex-grow overflow-hidden">
                        <div className="flex items-center gap-2">
                            <HighlightedSubstring
                                word={props.username}
                                substring={props.searchQuery}
                                foundAt={props.username.toLowerCase().indexOf(props.searchQuery.toLowerCase())}
                                styles="hover:!px-0"
                                action={props.navigateToProfile}
                            />
                            <p className="text-[14px] seller-level"
                            style={sellerLevelTextStyles[props.sellerLevel]}>
                                {props.sellerLevel}
                            </p>
                        </div>
                        <p className="text-[14px] text-side-text-gray 
                        whitespace-nowrap text-ellipsis overflow-hidden mt-[2px]">
                            {props.summary}
                        </p>
                        <p className="text-[14px] text-side-text-gray">
                            {props.country}
                        </p>
                    </div>
                </div>
                {props.option && 
                <SaveSeller 
                    svgSize={24}
                    sellerID={props.sellerID}
                    isSaved={props.option === SellerOptions.REMOVE}
                    action={removeSavedSeller}
                />}
            </div>
            <AnimatePresence>
                {errorMessage !== "" &&
                <ErrorPopUp
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
        </div>
    )
}

export default Seller;
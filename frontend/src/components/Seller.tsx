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

interface SellerProps {
    navigateToProfile: () => void,
    profilePicURL: string,
    status: string,
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

    async function removeSavedSeller(): Promise<string | undefined> {
        if (!props.canRemove || props.canRemove.deletingSeller) {
            return;
        }

        try {
            props.canRemove.setDeletingSeller(true);
            await axios.delete<{ message: string }>(`/api/users/${userContext.userData.username}/saved/sellers/${props.sellerID}`);
            props.canRemove.count.current -= 1;
            props.canRemove.setDeletingSeller(false);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            props.canRemove.setDeletingSeller(false);
            return errorMessage;
        }
    }
    
    if (hide) {
        return <></>
    }

    return (
        <div className="flex items-center justify-between gap-[5px]">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-[#f7f7f7] rounded-[6px]
            transition-all ease-out duration-100 p-2 flex-grow overflow-hidden" onClick={props.navigateToProfile}>
                {windowSize > 400 &&
                <div className="relative">
                    <ProfilePicAndStatus
                        profilePicURL={props.profilePicURL}
                        profileStatus={props.status}
                        statusStyles={props.statusStyles}
                        imgStyles={props.imgStyles}
                    />
                </div>}
                <div className="flex-grow overflow-hidden">
                    <div className="flex items-center gap-2">
                        <HighlightedSubstring
                            word={props.username}
                            substring={props.searchQuery}
                            foundAt={props.username.toLowerCase().indexOf(props.searchQuery.toLowerCase())}
                            styles="hover:!px-0"
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
            {props.option === SellerOptions.SAVE && 
            <SaveSeller 
                svgSize={24}
                sellerID={props.sellerID}
            />}
            {props.option === SellerOptions.REMOVE && 
            <Button
                action={removeSavedSeller}
                completedText="Removed"
                defaultText="Remove"
                loadingText="Removing"
                styles="red-btn h-[33px] w-fit rounded-[6px]"
                textStyles="text-error-text"
                setErrorMessage={setErrorMessage}
                redLoadingIcon={true}
                whenComplete={() => setHide(true)}
            />}
        </div>
    )
}

export default Seller;
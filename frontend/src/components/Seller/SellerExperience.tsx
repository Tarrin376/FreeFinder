import { sellerLevelTextStyles } from "../../utils/sellerLevelTextStyles";
import { useEffect, useContext, useCallback } from "react";
import { INotification } from "src/models/INotification";
import { UserContext } from "src/providers/UserProvider";

interface SellerExperienceProps {
    level: string,
    nextLevel: string,
    sellerXP: number,
    nextLevelXP: number,
    text?: string,
    styles?: string
}

function SellerExperience({ level, nextLevel, nextLevelXP, sellerXP, text, styles }: SellerExperienceProps) {
    const userContext = useContext(UserContext);

    const updateSellerXP = useCallback((notification: INotification) => {
        userContext.setUserData({
            ...userContext.userData,
            seller: userContext.userData.seller ? {
                ...userContext.userData.seller,
                sellerXP: userContext.userData.seller.sellerXP + notification.xp
            } : null
        });
    }, [userContext]);

    useEffect(() => {
        userContext.socket?.on("receive-notification", updateSellerXP);

        return () => {
            userContext.socket?.off("receive-notification", updateSellerXP);
        }
    }, [userContext.socket, updateSellerXP]);

    return (
        <div className={styles}>
            {text &&
            <h2 className="text-[18px] mb-[22px]">
                {text}
            </h2>}
            <div>
                <div className="flex items-center justify-between w-full mb-[10px]">
                    <p className="text-sm seller-level" style={sellerLevelTextStyles[level]}>
                        {level}
                    </p>
                    {nextLevel !== level &&
                    <p className="text-sm seller-level" style={sellerLevelTextStyles[nextLevel]}>
                        {nextLevel}
                    </p>}
                </div>
                <div className="rounded-full w-full bg-very-light-gray h-[14px] overflow-hidden">
                    <div className="bg-gradient-to-r from-main-black to-main-blue h-full rounded-full flex items-center justify-center 
                    transition duration-300 ease-linear" style={{ width: `calc(100% / ${nextLevelXP} * ${sellerXP})`}}>
                    </div>
                </div>
                <p className="bg-highlight text-main-blue border border-[#4169f7] w-fit text-sm 
                px-3 py-[1px] rounded-[6px] mt-[10px] ml-auto">
                    {`${sellerXP} / ${nextLevelXP}`}
                </p>
            </div>
        </div>
    )
}

export default SellerExperience;
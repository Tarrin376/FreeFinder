import ToggleSwitch from "./ToggleSwitch";
import { useReducer, useContext, useState } from "react";
import { motion } from "framer-motion";
import CloseSvg from "./CloseSvg";
import { NotificationSections } from "src/enums/NotificationSections";
import { UserContext } from "src/providers/UserProvider";
import { fetchUpdatedUser } from "src/utils/fetchUpdatedUser";
import { TNotificationSettings } from "src/types/TNotificationSettings";
import { getAPIErrorMessage } from "src/utils/getAPIErrorMessage";
import ErrorPopUp from "./ErrorPopUp";
import { AxiosError } from "axios";
import { AnimatePresence } from "framer-motion";

type NotificationSettingsState = {
    mentionsAndReplies: boolean,
    orderRequests: boolean,
    rewards: boolean,
    savedServices: boolean
}

interface NotificationSettingsProps {
    updateSection: (section: NotificationSections) => void
}

function NotificationSettings({ updateSection }: NotificationSettingsProps) {
    const userContext = useContext(UserContext);

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [state, dispatch] = useReducer((cur: NotificationSettingsState, payload: Partial<NotificationSettingsState>) => {
        return { ...cur, ...payload };
    }, {
        mentionsAndReplies: userContext.userData.notificationSettings?.mentionsAndReplies ?? true,
        orderRequests: userContext.userData.notificationSettings?.orderRequests ?? true,
        rewards: userContext.userData.notificationSettings?.rewards ?? true,
        savedServices: userContext.userData.notificationSettings?.savedServices ?? true
    });

    async function updateNotificationSettings(updatedSettings: Partial<NotificationSettingsState>): Promise<void> {
        try {
            const updated = await fetchUpdatedUser({ 
                notificationSettings: { ...state, ...updatedSettings } as TNotificationSettings 
            }, userContext.userData.username);

            userContext.setUserData(updated.userData);
            dispatch(updatedSettings);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    return (
        <motion.div className="p-4 flex flex-col min-h-0" initial={{ x: "-100%" }} 
        animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.1 }}>
            <AnimatePresence>
                {errorMessage !== "" && 
                <ErrorPopUp 
                    errorMessage={errorMessage} 
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
            <CloseSvg
                size={20}
                colour="#9c9c9c"
                action={() => updateSection(NotificationSections.allNotifications)}
            />
            <h3 className="text-[18px] mb-2 mt-2">
                Settings
            </h3>
            <p className="text-sm text-side-text-gray">
                Fine-tune the notifications that you would like to see - and those you don't.
            </p>
            <div className="overflow-y-scroll flex-grow pr-[8px] mt-4">
                <ToggleSwitch 
                    toggle={state.mentionsAndReplies} 
                    updateToggle={(value: boolean) => updateNotificationSettings({ mentionsAndReplies: value })} 
                    title="Mentions and replies"
                    text="Show all mentions and replies from my group chats."
                />
                <ToggleSwitch 
                    toggle={state.orderRequests} 
                    updateToggle={(value: boolean) => updateNotificationSettings({ orderRequests: value })} 
                    title="Order requests"
                    text="Show me all order requests made on my services."
                    styles="mt-4"
                />
                <ToggleSwitch 
                    toggle={state.rewards} 
                    updateToggle={(value: boolean) => updateNotificationSettings({ rewards: value })} 
                    title="Rewards"
                    text="Let me know of any rewards that I have received, including seller xp and discount codes."
                    styles="mt-4"
                />
                <ToggleSwitch 
                    toggle={state.savedServices} 
                    updateToggle={(value: boolean) => updateNotificationSettings({ savedServices: value })} 
                    title="Saved services"
                    text="Notify me when one of my saved services is temporarily hidden or is permanently removed by the seller."
                    styles="mt-4"
                />
            </div>
        </motion.div>
    )
}

export default NotificationSettings;
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";
import { motion } from "framer-motion";
import CloseSvg from "./CloseSvg";
import { NotificationSections } from "src/enums/NotificationSections";

interface NotificationSettingsProps {
    updateSection: (section: NotificationSections) => void
}

function NotificationSettings({ updateSection }: NotificationSettingsProps) {
    const [disableAll, setDisableAll] = useState<boolean>(false);

    return (
        <motion.div className="p-4 flex flex-col min-h-0" initial={{ x: "-100%" }} 
        animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.1 }}>
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
                    toggle={disableAll} 
                    updateToggle={setDisableAll} 
                    title="Mentions and replies"
                    text="Show all mentions and replies from my group chats."
                />
                <ToggleSwitch 
                    toggle={disableAll} 
                    updateToggle={setDisableAll} 
                    title="Order requests"
                    text="Show me all order requests made on my services."
                    styles="mt-4"
                />
                <ToggleSwitch 
                    toggle={disableAll} 
                    updateToggle={setDisableAll} 
                    title="Rewards"
                    text="Let me know of any rewards that I have received, including seller xp, discount codes, and much more."
                    styles="mt-4"
                />
                <ToggleSwitch 
                    toggle={disableAll} 
                    updateToggle={setDisableAll} 
                    title="Rewards"
                    text="Let me know of any rewards that I have received, including seller xp, discount codes, and much more."
                    styles="mt-4"
                />
            </div>
        </motion.div>
    )
}

export default NotificationSettings;
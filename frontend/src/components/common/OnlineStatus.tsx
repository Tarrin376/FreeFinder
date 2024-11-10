import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import InfoPopUp from "./InfoPopUp";
import { AnimatePresence } from "framer-motion";

function OnlineStatus() {
    const { onlineMessage, offlineMessage, closePopUp } = useOnlineStatus();

    return (
        <AnimatePresence>
            {(onlineMessage || offlineMessage) && 
            <InfoPopUp
                message={onlineMessage ? onlineMessage : offlineMessage}
                closePopUp={closePopUp}
                styles={onlineMessage ? "bg-light-green" : "bg-error-text"}
            />}
        </AnimatePresence>
    )
}

export default OnlineStatus;
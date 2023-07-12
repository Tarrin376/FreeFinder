import { motion } from "framer-motion";
import CloseSmallIcon from "../assets/close-small.png";
import { useEffect } from "react";

interface InfoPopUpProps {
    message: string,
    closePopUp: () => void,
    styles?: string,
}

function InfoPopUp({ message, closePopUp, styles }: InfoPopUpProps) {
    useEffect(() => {
        setTimeout(() => {
            closePopUp();
        }, 7000);
    }, [closePopUp]);

    return (
        <motion.div className={`flex items-center justify-between p-3 fixed z-50 bottom-10
        left-[50%] translate-x-[-50%] shadow-pop-up gap-3 max-w-[500px] rounded-[8px] ${styles}`}
        initial={{ opacity: 0, y: 200, x: '-50%' }} animate={{ opacity: 1, y: 0,  x: '-50%' }} 
        exit={{ opacity: 0, y: 200,  x: '-50%' }} transition={{ duration: 0.2 }}>
            <p className="text-main-white flex-grow whitespace-normal">{message}</p>
            <img 
                src={CloseSmallIcon} 
                className="text-main-white w-[20px] h-[20px] cursor-pointer" 
                alt="close"
                onClick={closePopUp}
            />
        </motion.div>
    )
}

export default InfoPopUp;
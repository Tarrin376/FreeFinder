import { motion } from "framer-motion";
import CloseSvg from "./CloseSvg";
import { useEffect } from "react";

interface InfoPopUpProps {
    message: string,
    closePopUp: () => void,
    styles?: string,
}

function InfoPopUp({ message, closePopUp, styles }: InfoPopUpProps) {
    const defaultStyles = `flex items-center justify-between p-3 fixed z-50 bottom-10
    left-[50%] translate-x-[-50%] shadow-pop-up gap-3 max-w-[500px] rounded-[8px]`;

    useEffect(() => {
        setTimeout(() => {
            closePopUp();
        }, 6000);
    }, [closePopUp]);

    return (
        <motion.div className={`${defaultStyles} ${styles}`} initial={{ opacity: 0, y: 200, x: '-50%' }} 
        animate={{ opacity: 1, y: 0,  x: '-50%' }} exit={{ opacity: 0, y: 200,  x: '-50%' }} transition={{ duration: 0.2 }}>
            <p className="text-main-white flex-grow whitespace-normal text-center">
                {message}
            </p>
            <CloseSvg
                size={24}
                colour="#fefefe"
                action={closePopUp}
            />
        </motion.div>
    )
}

export default InfoPopUp;
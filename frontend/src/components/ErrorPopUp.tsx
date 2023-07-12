import CloseSmallIcon from "../assets/close-small.png";
import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface ErrorPopUpProps {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    errorMessage: string
}

function ErrorPopUp({ errorMessage, setErrorMessage }: ErrorPopUpProps) {
    const closePopUp = useCallback(() => {
        if (errorMessage !== "") {
            setErrorMessage("");
        }
    }, [setErrorMessage, errorMessage]);

    useEffect(() => {
        setTimeout(() => {
            closePopUp();
        }, 7000);
    }, [closePopUp]);

    return (
        <motion.div className="flex items-center justify-between p-3 
        bg-error-text fixed z-50 bottom-7 left-[50%] translate-x-[-50%] shadow-pop-up gap-3 max-w-[500px]"
        initial={{ opacity: 0, y: 200, x: '-50%' }} animate={{ opacity: 1, y: 0,  x: '-50%' }} 
        exit={{ opacity: 0, y: 200,  x: '-50%' }} transition={{ duration: 0.2 }}>
            <p className="text-main-white flex-grow whitespace-normal">{errorMessage}</p>
            <img 
                src={CloseSmallIcon} 
                className="text-main-white w-[20px] h-[20px] cursor-pointer" 
                alt="close"
                onClick={closePopUp}
            />
        </motion.div>
    )
}

export default ErrorPopUp;
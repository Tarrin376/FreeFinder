import CloseIcon from '../assets/close.png';
import { motion } from 'framer-motion';

interface PopUpWrapperProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    children?: React.ReactNode,
    styles?: string,
}

function PopUpWrapper({ children, setIsOpen, title, styles } : PopUpWrapperProps) {
    function closePopUp(): void {
        setIsOpen(false);
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full z-40 bg-[#00000027] flex items-center justify-center">
            <motion.div className={`bg-main-white p-9 rounded-[12px] shadow-pop-up
            overflow-y-scroll max-h-[92%] scrollbar-hide max-w-[540px] w-[95%] ${styles}`}
            initial={{ opacity: 0, y: 200 }} animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 200 }} transition={{ type: "spring", duration: 0.2 }}>
                <div className="flex items-center w-full justify-between mb-7">
                    <h1 className="text-[23px]">{title}</h1>
                    <img src={CloseIcon} className="w-6 h-6 cursor-pointer" onClick={closePopUp} alt="close" />
                </div>
                {children}
            </motion.div>
        </div>
    );
}

export default PopUpWrapper;
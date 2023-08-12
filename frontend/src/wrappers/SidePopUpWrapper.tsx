import { motion } from "framer-motion";
import OutsideClickHandler from "react-outside-click-handler";

interface SidePopUpWrapperProps {
    setIsOpen: () => void,
    children: React.ReactNode
}

function SidePopUpWrapper({ setIsOpen, children }: SidePopUpWrapperProps) {
    return (
        <motion.div className="w-fit h-fit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} transition={{ type: "spring", duration: 0.2 }}>
            <OutsideClickHandler onOutsideClick={setIsOpen}>
                {children}
            </OutsideClickHandler>
        </motion.div>
    )
}

export default SidePopUpWrapper;
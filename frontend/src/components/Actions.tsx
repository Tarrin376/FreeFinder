import ActionsIcon from "../assets/actions.png";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import OutsideClickHandler from "react-outside-click-handler";

interface ActionsProps {
    children: React.ReactNode
}

function Actions({ children }: ActionsProps) {
    const [toggleActions, setToggleActions] = useState<boolean>(false);
    
    return (
        <div className="w-[50px] h-[50px] relative">
            <div className="w-full h-full hover:bg-hover-light-gray flex items-center justify-center rounded-full cursor-pointer" 
            onClick={() => setToggleActions((cur) => !cur)}>
                <img src={ActionsIcon} className="w-[27px] h-[27px]" alt="" />
            </div>
            <AnimatePresence>
                {toggleActions &&
                <motion.div className="dropdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
                    <OutsideClickHandler onOutsideClick={() => setToggleActions(false)}>
                        <div className="flex flex-col gap-4">
                            {children}
                        </div>
                    </OutsideClickHandler>
                </motion.div>}
            </AnimatePresence>
        </div>
    )
}

export default Actions;
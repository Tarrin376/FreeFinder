import CloseSvg from '../components/svg/CloseSvg';
import { motion } from 'framer-motion';
import { useWindowSize } from '../hooks/useWindowSize';

interface PopUpWrapperProps {
    setIsOpen: (val: boolean) => void,
    title: string,
    children: React.ReactNode | [React.ReactNode, React.ReactNode],
    styles?: string,
    firstChildStyles?: string
}

function PopUpWrapper({ children, setIsOpen, title, styles, firstChildStyles } : PopUpWrapperProps) {
    const windowSize = useWindowSize();
    const defaultStyles = `bg-main-white rounded-[12px] shadow-pop-up 
    max-h-[95%] h-fit max-w-[520px] w-[95%] m-auto flex flex-col overflow-hidden`;

    function closePopUp(): void {
        setIsOpen(false);
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-[#00000057] z-50 flex items-center justify-center">
            <motion.div className={`${defaultStyles} ${styles}`} initial={{ opacity: 0, scale: 0.80 }} 
            animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.80 }} transition={{ type: "spring", duration: 0.4 }}>
                <div className={`${windowSize >= 500 ? "p-5" : "p-3"} border-b border-light-border-gray w-full relative`}>
                    <div className={`absolute ${windowSize >= 500 ? "top-[23px] left-5" : "top-[15px] left-3"}`}>
                        <CloseSvg
                            size={22}
                            colour="#9c9c9c"
                            action={closePopUp}
                        />
                    </div>
                    <h1 className={`text-[18px] text-center ${title === "" ? "collapse" : ""}`}>
                        {title || "placeholder"}
                    </h1>
                </div>
                <div className={`overflow-y-scroll flex flex-col h-full ${windowSize >= 500 ? "p-5" : "p-3"} ${firstChildStyles}`}>
                    {Array.isArray(children) ? children[0] : children}
                </div>
                {Array.isArray(children) &&
                <div className={`${windowSize >= 500 ? "p-5" : "p-3"} border-t border-light-border-gray`}>
                    {children[1]}
                </div>}
            </motion.div>
        </div>
    );
}

export default PopUpWrapper;
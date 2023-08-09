import CloseSvg from '../components/CloseSvg';
import { motion } from 'framer-motion';

interface PopUpWrapperProps {
    setIsOpen: (val: boolean) => void,
    title: string,
    children?: React.ReactNode,
    styles?: string,
}

function PopUpWrapper({ children, setIsOpen, title, styles } : PopUpWrapperProps) {
    const defaultStyles = `bg-main-white p-7 rounded-[12px] shadow-pop-up overflow-y-scroll 
    max-h-[95%] scrollbar-hide max-w-[520px] w-[95%] m-auto flex flex-col`;

    function closePopUp(): void {
        setIsOpen(false);
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full z-50 bg-[#00000027] flex items-center justify-center">
            <motion.div className={`${defaultStyles} ${styles}`} initial={{ opacity: 0, scale: 0.80 }} 
            animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.80 }} transition={{ type: "spring", duration: 0.4 }}>
                <div className="flex items-center w-full justify-between gap-[14px] mb-6">
                    <h1 className="text-[22px]">
                        {title}
                    </h1>
                    <CloseSvg
                        size={27}
                        colour="#9c9c9c"
                        action={closePopUp}
                    />
                </div>
                {children}
            </motion.div>
        </div>
    );
}

export default PopUpWrapper;
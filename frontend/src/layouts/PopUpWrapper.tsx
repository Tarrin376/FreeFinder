import OutsideClickHandler from 'react-outside-click-handler';
import CloseIcon from '../assets/close.png';

interface PopUpWrapperProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    children?: React.ReactNode,
    styles?: string
}

function PopUpWrapper({ children, setIsOpen, title, styles } : PopUpWrapperProps) {
    function closePopUp() {
        setIsOpen(false);
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full z-10 bg-pop-up-bg">
            <OutsideClickHandler onOutsideClick={closePopUp}>
                <div className={`bg-main-white absolute p-9 rounded-[8px] shadow-pop-up left-[50%] top-[50%] translate-x-[-50%] 
                translate-y-[-50%] max-w-[540px] w-[95%] overflow-y-scroll max-h-[92%] scrollbar-hide ${styles}`}>
                    <div className="flex items-center w-full justify-between mb-7">
                        <h1 className="text-[26px]">{title}</h1>
                        <img src={CloseIcon} className="w-4 h-4 cursor-pointer" onClick={closePopUp} alt="close" />
                    </div>
                    {children}
                </div>
            </OutsideClickHandler>
        </div>
    );
}

export default PopUpWrapper;
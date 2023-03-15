import OutsideClickHandler from 'react-outside-click-handler';

interface PopUpWrapperProps {
    children?: React.ReactNode,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function PopUpWrapper({ children, setIsOpen } : PopUpWrapperProps) {
    return (
        <div className="fixed w-full h-full z-10">
            <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
                <div className="bg-main-white absolute p-9 rounded-[8px] shadow-pop-up border border-nav-search-gray
                left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[540px] w-[95%]">
                    {children}
                </div>
            </OutsideClickHandler>
        </div>
    );
}

export default PopUpWrapper;
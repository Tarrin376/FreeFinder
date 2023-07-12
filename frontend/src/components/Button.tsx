import { useRef, useState, useEffect } from "react";
import WhiteLoadingIcon from '../assets/loading-white.svg';
import RedLoadingIcon from '../assets/loading-red.svg';

interface ButtonProps {
    action: () => Promise<string | undefined>,
    completedText: string,
    defaultText: string,
    loadingText: string,
    styles: string,
    children?: React.ReactNode,
    textStyles: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    keepErrorMessage?: boolean,
    whenComplete?: () => void,
    redLoadingIcon?: boolean
}

function Button(props: ButtonProps) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [btnText, setBtnText] = useState(props.defaultText);
  
    const handleAction = async () => {
        setBtnText(props.loadingText);
        const error = await props.action();

        if (!error) {
            props.setErrorMessage("");
            setBtnText(props.completedText);
        } else {
            props.setErrorMessage(error);
            if (!props.keepErrorMessage) {
                setTimeout(() => {
                    props.setErrorMessage("");
                }, 7000);
            } 

            setBtnText(props.defaultText);
        }
    }
  
    useEffect(() => {
        if (btnText !== props.completedText || !btnRef || !btnRef.current) {
            return;
        }
        
        btnRef.current.classList.add('success-btn');
        setTimeout(() => {
            if (btnRef && btnRef.current) {
                btnRef.current.classList.remove('success-btn');
                setBtnText(props.defaultText);
                if (props.whenComplete) {
                    props.whenComplete();
                }
            }
        }, 1500);
    }, [btnText, props])
  
    useEffect(() => {
        setBtnText(props.defaultText);
    }, [props.defaultText])
  
    return (
        <button className={`${props.styles} ${btnText !== props.defaultText ? "pointer-events-none" : ""}`} 
        ref={btnRef} onClick={handleAction} type="submit">
            <div className="flex items-center justify-center gap-[10px]">
                {btnText === props.loadingText ? 
                <img src={props.redLoadingIcon ? RedLoadingIcon : WhiteLoadingIcon} className="w-8 mt-[1px]" alt="" /> :
                props.children && btnText === props.defaultText && props.children}
                <p className={props.textStyles}>
                    {btnText}
                </p>
            </div>
        </button>
    )
};

export default Button;
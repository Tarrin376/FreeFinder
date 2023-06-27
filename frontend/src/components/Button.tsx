import { useRef, useState, useEffect } from "react";
import LoadingIcon from '../assets/Infinity-1s-200px.svg';

interface ButtonProps {
    action: () => Promise<string | undefined>,
    completedText: string,
    defaultText: string,
    loadingText: string,
    styles: string,
    children?: React.ReactNode,
    textColor: string,
    hideLoadingIcon?: boolean,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    whenComplete?: () => void
}

function Button(props: ButtonProps) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [btnText, setBtnText] = useState(props.defaultText);
    const [disabled, setDisabled] = useState<boolean>(false);
  
    const handleAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setBtnText(props.loadingText);
        
        const error = await props.action();
        if (!error) {
            setBtnText(props.completedText);
        } else {
            props.setErrorMessage(error);
            setDisabled(true);
    
            setTimeout(() => {
                props.setErrorMessage("");
                setDisabled(false);
            }, 3500);
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
        <button className={`${props.styles} ${btnText !== props.defaultText ? "pointer-events-none" : ""} 
        ${disabled ? "pointer-events-none invalid-button" : ""}`} 
        ref={btnRef} onClick={handleAction} type="submit">
            <div className="flex items-center justify-center gap-3">
                {btnText === props.loadingText && !props.hideLoadingIcon ? <img src={LoadingIcon} className="w-8 mt-[1px]" alt="..." />
                : props.children && btnText === props.defaultText && props.children}
                <p className={disabled ? "text-disabled-gray" : props.textColor}>
                    {`${btnText}${props.hideLoadingIcon && btnText === props.loadingText ? "..." : ""}`}
                </p>
            </div>
        </button>
    )
  };
  
  export default Button;
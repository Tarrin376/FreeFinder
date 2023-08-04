import { useRef, useState, useEffect } from "react";
import LoadingSvg from "./LoadingSvg";

interface ButtonProps {
    action: () => Promise<string | undefined>,
    defaultText: string,
    loadingText: string,
    styles: string,
    textStyles: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    loadingSvgSize: number,
    children?: React.ReactNode,
    completedText?: string,
    whenComplete?: () => void,
    loadingSvgColour?: string,
    type?: "button" | "submit" | "reset",
    keepErrorMessage?: boolean
}

function Button(props: ButtonProps) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [btnText, setBtnText] = useState(props.defaultText);
  
    async function handleAction(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setBtnText(props.loadingText);
        const error = await props.action();

        if (!error) {
            props.setErrorMessage("");
            if (props.completedText) {
                setBtnText(props.completedText);
            }
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
    }, [btnText, props]);
  
    useEffect(() => {
        setBtnText(props.defaultText);
    }, [props.defaultText]);
  
    return (
        <button className={`${btnText !== props.defaultText ? "pointer-events-none" : ""} ${props.styles}`} 
        ref={btnRef} onClick={handleAction} type={props.type ?? "button"}>
            <div className="flex items-center justify-center gap-[10px]">
                {btnText === props.loadingText ? 
                <LoadingSvg
                    size={props.loadingSvgSize}
                    colour={props.loadingSvgColour}
                /> :
                props.children && btnText === props.defaultText && props.children}
                <p className={props.textStyles}>
                    {btnText}
                </p>
            </div>
        </button>
    )
};

export default Button;
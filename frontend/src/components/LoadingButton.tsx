import LoadingIcon from '../assets/Infinity-1s-200px.svg';

interface LoadingButtonProps {
    loading: boolean,
    text: string
    loadingText: string,
    callback: (e: React.MouseEvent<HTMLButtonElement>) => Promise<any>,
    disabled: boolean,
    loadingColour: string,
    styles?: string,
    completed?: boolean,
    completedText?: string
}

function LoadingButton({ loading, text, loadingText, callback, styles, disabled, 
    loadingColour, completed, completedText }: LoadingButtonProps) {

    return (
        <button type="submit" className={`loading-btn ${styles} ${loading ? `cursor-not-allowed hover:!${loadingColour}` 
        : `${completed ? "hover:!bg-[#36BF54] bg-[#36BF54] !text-main-white" : ""}`}`}
        onClick={callback} disabled={loading || disabled || completed}>
            {loading && <img src={LoadingIcon} className="w-9" alt="loading" />}
            {loading ? loadingText : completed ? completedText : text}
        </button>
    );
}

export default LoadingButton;
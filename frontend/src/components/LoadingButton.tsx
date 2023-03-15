import LoadingIcon from '../assets/Infinity-1s-200px.svg';

interface LoadingButtonProps {
    loading: boolean,
    text: string
    loadingText: string,
    callback: (e: React.MouseEvent<HTMLButtonElement>) => Promise<any>,
    styles?: string,
    disabled: boolean
}

function LoadingButton({ loading, text, loadingText, callback, styles, disabled }: LoadingButtonProps) {
    return (
        <button type="submit" className={`main-btn ${styles} ${loading ? 'cursor-not-allowed hover:!bg-main-black' : ''}`}
        onClick={callback} disabled={loading || disabled}>
            {loading && <img src={LoadingIcon} className="w-9" alt="loading" />}
            {loading ? loadingText : text}
        </button>
    );
}

export default LoadingButton;
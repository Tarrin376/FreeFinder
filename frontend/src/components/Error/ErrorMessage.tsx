import ErrorIcon from '../../assets/warning.png';
import CloseSvg from '../svg/CloseSvg';

interface ErrorMessageProps {
    message: string,
    title: string,
    styles?: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

function ErrorMessage({ message, title, styles, setErrorMessage }: ErrorMessageProps) {
    const defaultStyles = `border-nav-search-gray border rounded-[11px] p-3 mb-5 flex items-center gap-3`;

    function closeErrorMessage(): void {
        setErrorMessage("");
    }

    return (
        <div className={`${defaultStyles} ${styles}`}>
            <img src={ErrorIcon} className="w-11 h-11" alt="" />
            <div className="flex items-center justify-between gap-3 flex-grow">
                <div>
                    <p className="mb-[2px]">{title}</p>
                    <p className="text-side-text-gray leading-5">{message}</p>
                </div>
                <div className="min-w-[24px]">
                    <CloseSvg
                        size={24}
                        colour="#9c9c9c"
                        action={closeErrorMessage}
                    />
                </div>
            </div>
        </div>
    );
}

export default ErrorMessage;
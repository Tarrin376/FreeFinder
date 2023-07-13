import ErrorIcon from '../assets/warning.png';
import CloseSvg from './CloseSvg';

interface ErrorMessageProps {
    message: string,
    title: string,
    styles?: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

function ErrorMessage({ message, title, styles, setErrorMessage }: ErrorMessageProps) {
    function closeErrorMessage(): void {
        setErrorMessage("");
    }

    return (
        <div className={`border-nav-search-gray border rounded-[11px] p-3 mb-6 flex items-center gap-3 ${styles}`}>
            <img src={ErrorIcon} className="w-11 h-11" alt="" />
            <div className="flex-grow">
                <p className="mb-[2px]">{title}</p>
                <p className="text-side-text-gray leading-5 mb-[2px]">{message}</p>
            </div>
            <CloseSvg
                size="30px"
                colour="#9c9c9c"
                action={closeErrorMessage}
            />
        </div>
    );
}

export default ErrorMessage;
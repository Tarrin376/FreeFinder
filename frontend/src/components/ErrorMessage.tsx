import ErrorIcon from '../assets/warning.png';

interface ErrorMessageProps {
    message: string,
    title: string
}

function ErrorMessage({ message, title }: ErrorMessageProps) {
    return (
        <div className="border-nav-search-gray border rounded-[11px] p-3 mb-6 flex items-center gap-3">
            <img src={ErrorIcon} className="w-11 h-11" alt="errorIcon" />
            <div>
                <p className="text-[15px] font-semibold mb-1">{title}</p>
                <p className="text-side-text-gray leading-5">{message}</p>
            </div>
        </div>
    );
}

export default ErrorMessage;
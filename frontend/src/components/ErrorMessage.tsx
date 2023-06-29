import ErrorIcon from '../assets/warning.png';

interface ErrorMessageProps {
    message: string,
    title: string,
    styles?: string
}

function ErrorMessage({ message, title, styles }: ErrorMessageProps) {
    return (
        <div className={`border-nav-search-gray border rounded-[11px] p-3 mb-6 flex items-center gap-3 ${styles}`}>
            <img src={ErrorIcon} className="w-11 h-11" alt="" />
            <div>
                <p className="mb-[2px]">{title}</p>
                <p className="text-side-text-gray leading-5 mb-[2px]">{message}</p>
            </div>
        </div>
    );
}

export default ErrorMessage;
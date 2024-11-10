import { useCountdown } from "../../hooks/useCountdown"

interface ExpiresInProps {
    expires: Date,
    styles?: string
}

function ExpiresIn({ expires, styles }: ExpiresInProps) {
    const timeRemaining = useCountdown(expires);

    return (
        <p className={`text-[15px] ${styles}`}>
            Expires in:
            <span className="text-error-text text-[15px]">
                {` ${timeRemaining}`}
            </span>
        </p>
    )
}

export default ExpiresIn;
interface TextBoxErrorMessageProps {
    error: string
}

function TextBoxErrorMessage({ error }: TextBoxErrorMessageProps) {
    return (
        <p className="text-error-text mt-1 text-[15px]">
            {error}
        </p>
    )
}

export default TextBoxErrorMessage;
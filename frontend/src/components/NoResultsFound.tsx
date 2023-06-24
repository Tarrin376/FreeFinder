
interface NoResultsFoundProps {
    title: string,
    message: string
}

function NoResultsFound({ title, message }: NoResultsFoundProps) {
    return (
        <div className="w-full m-auto">
            <h1 className="text-center mb-3 text-[26px]">{title}</h1>
            <p className="text-center">{message}</p>
        </div>
    )
}

export default NoResultsFound;
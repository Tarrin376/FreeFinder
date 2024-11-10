import NothingFoundIcon from '../../assets/nothing-found.png';

interface NoResultsFoundProps {
    title: string,
    message: string
}

function NoResultsFound({ title, message }: NoResultsFoundProps) {
    return (
        <div className="w-full m-auto">
            <img src={NothingFoundIcon} className="w-[64px] h-[64px] block m-auto mb-4" alt="" />
            <h1 className="text-center mb-1 text-[18px]">{title}</h1>
            <p className="text-center">{message}</p>
        </div>
    )
}

export default NoResultsFound;
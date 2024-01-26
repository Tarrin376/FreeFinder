import KeyPair from "./KeyPair";

interface ServiceIDProps {
    data: string,
    setInfoMessage: React.Dispatch<React.SetStateAction<string>>
    postID: string,
    textSize: number,
    hideText?: boolean,
    styles?: string
}

function ServiceID({ data, setInfoMessage, postID, textSize, hideText, styles }: ServiceIDProps) {
    const defaultStyles = `flex items-center justify-between w-fit max-w-full gap-4 overflow-hidden`;

    function copyServiceID() {
        if (data) {
            navigator.clipboard.writeText(data);
            setInfoMessage("Copied to clipboard.");
        }
    }

    return (
        <div className={`${defaultStyles} ${styles}`}>
            {!hideText && 
            <KeyPair
                itemKey="Service ID"
                itemValue={postID}
                textSize={textSize}
                styles="pt-[1px] text-ellipsis whitespace-nowrap overflow-hidden"
            />} 
            <button className="side-btn w-fit !h-[30px] rounded-[6px]" 
            style={hideText ? { background: "transparent", border: "none", whiteSpace: "nowrap" } 
            : { fontSize: `${textSize}px` }} onClick={copyServiceID}>
                {hideText ? "Copy service ID" : "Copy"}
            </button>
        </div>
    )
}

export default ServiceID;
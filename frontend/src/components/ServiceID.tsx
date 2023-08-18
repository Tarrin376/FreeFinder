import KeyPair from "./KeyPair";

interface ServiceIDProps {
    action: () => void,
    postID: string,
    textSize: number,
    styles?: string
}

function ServiceID({ action, postID, textSize, styles }: ServiceIDProps) {
    const defaultStyles = `flex items-center justify-between w-fit max-w-full gap-4 overflow-hidden`;

    return (
        <div className={`${defaultStyles} ${styles}`}>
            <KeyPair
                itemKey="Service ID"
                itemValue={postID}
                textSize={textSize}
                styles="pt-[1px] text-ellipsis whitespace-nowrap overflow-hidden"
            />
            <button className="side-btn w-fit !h-[30px] rounded-[6px]" 
            style={{ fontSize: `${textSize}px` }} onClick={action}>
                copy
            </button>
        </div>
    )
}

export default ServiceID;
import { useState } from "react";

interface SaveProps {
    action: (checked: boolean) => Promise<string | undefined | boolean | void>,
    svgSize: number,
    hoverText: string,
    styles?: string,
    isSaved?: boolean,
    hideSaveMessage?: boolean
}

function Save({ action, svgSize, styles, hoverText, isSaved, hideSaveMessage }: SaveProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(isSaved ?? false);

    async function handleClick(): Promise<void> {
        if (!loading) {
            setLoading(true);
            await action(saved);
            setLoading(false);
            setSaved((cur) => !cur);
        }
    }

    return (
        <div className={styles}>
            <div hover-text={`${saved ? "Unsave" : "Save"} ${hoverText}`} className={`${!hideSaveMessage ? `relative after:w-0 hover:after:bg-main-black 
            hover:after:content-[attr(hover-text)] hover:after:p-[7px] after:absolute hover:after:whitespace-nowrap 
            hover:after:text-main-white after:right-1/2 after:translate-x-[50%] after:top-[-39px] 
            hover:after:rounded-[6px] hover:after:text-[14px] after:transition-all after:duration-100 after:ease-linear 
            hover:after:w-fit` : ""}`}>
                <svg
                    onClick={handleClick}
                    viewBox="0 0 32 32" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`block ${saved ? "fill-[#00d400b9]" : "fill-[#000000ab]"} stroke-white stroke-2 cursor-pointer`}
                    style={{ width: svgSize, height: svgSize, scale: loading ? '0.90' : '1' }}
                    aria-hidden="true" 
                    role="presentation" 
                    focusable="false">
                    <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                    </path>
                </svg>
            </div>
        </div>
    )
}

export default Save;
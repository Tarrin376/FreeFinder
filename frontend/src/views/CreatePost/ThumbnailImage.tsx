import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { parseFileBase64 } from "src/utils/parseFileBase64";

interface ThumbnailImageProps {
    file: File,
    thumbnail: File | undefined,
    changeThumbnail: (newThumbnail: File) => void
}

function ThumbnailImage({ file, thumbnail, changeThumbnail }: ThumbnailImageProps) {
    const [useAsThumbnail, setUseAsThumbnail] = useState<boolean>(false);
    const [base64Str, setBase64Str] = useState<string>("");

    useEffect(() => {
        (async () => {
            if (file) {
                const base64 = await parseFileBase64(file);
                setBase64Str(base64 as string);
            } else {
                setBase64Str("");
            }
        })();
    }, [file]);

    return (
        <div className="w-full pb-[66.66%] relative">
            <div className="w-full h-full absolute flex items-center justify-center overflow-hidden 
            rounded-[8px] border border-light-border-gray cursor-pointer"
            onMouseEnter={() => setUseAsThumbnail(true)} onMouseLeave={() => setUseAsThumbnail(false)} onClick={() => changeThumbnail(file)}>
                {base64Str &&
                <img 
                    src={base64Str} 
                    className="w-full object-center object-cover" 
                    alt={file.name} 
                />}
                <AnimatePresence>
                    {(file === thumbnail || useAsThumbnail) &&
                    <motion.div className={`w-full h-full absolute top-0 left-0 ${file === thumbnail ? 
                    "bg-[#4168f7ce]" : "bg-[#1d1d1dd2]"} flex items-center justify-center`} initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <p className="text-main-white">
                            {file === thumbnail ? "Thumbnail selected" : "Select as thumbnail"}
                        </p>
                    </motion.div>}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ThumbnailImage;
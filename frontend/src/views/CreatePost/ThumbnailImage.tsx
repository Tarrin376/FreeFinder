import { FileData } from "src/types/FileData";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

interface ThumbnailImageProps {
    imageData: FileData,
    thumbnail: FileData | undefined,
    changeThumbnail: (newThumbnail: FileData) => void
}

function ThumbnailImage({ imageData, thumbnail, changeThumbnail }: ThumbnailImageProps) {
    const [useAsThumbnail, setUseAsThumbnail] = useState<boolean>(false);

    return (
        <div className="w-full pb-[66.66%] relative">
            <div className="w-full h-full absolute flex items-center justify-center overflow-hidden 
            rounded-[8px] border border-light-border-gray cursor-pointer"
            onMouseEnter={() => setUseAsThumbnail(true)} onMouseLeave={() => setUseAsThumbnail(false)} onClick={() => changeThumbnail(imageData)}>
                <img 
                    src={imageData.base64Str as string} 
                    className="w-full object-center object-cover" 
                    alt={imageData.file.name} 
                />
                <AnimatePresence>
                    {(imageData === thumbnail || useAsThumbnail) &&
                    <motion.div className={`w-full h-full absolute top-0 left-0 ${imageData === thumbnail ? 
                    "bg-[#4e73f8cc]" : "bg-[#1d1d1dd2]"} flex items-center justify-center`} initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <p className="text-main-white">
                            {imageData === thumbnail ? "Thumbnail selected" : "Select as thumbnail"}
                        </p>
                    </motion.div>}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ThumbnailImage;
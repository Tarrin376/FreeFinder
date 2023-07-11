import { IPostImage } from "../../models/IPostImage";
import { checkFile } from "../../utils/checkFile";
import { MAX_FILE_BYTES } from "../CreatePost/UploadPostFiles";
import { parseImage } from "../../utils/parseImage";
import { useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { PostPage } from "../../types/PostPage";
import { useLocation } from "react-router-dom";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import WhiteLoadingIcon from '../../assets/loading-white.svg';
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

interface PostImageProps {
    image: IPostImage,
    index: number,
    isOwner: boolean,
    setPostData: React.Dispatch<React.SetStateAction<PostPage | undefined>>,
    action: () => void
}

function PostImage({ image, index, isOwner, setPostData, action }: PostImageProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [updatingImage, setUpdatingImage] = useState<boolean>(false);
    const location = useLocation();

    function triggerFileUpload() {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    }

    async function uploadImage() {
        try {
            if (inputFileRef.current && inputFileRef.current.files) {
                setUpdatingImage(true);
                const newImage = inputFileRef.current.files[0];
                const valid = checkFile(newImage, MAX_FILE_BYTES);
                
                if (valid) {
                    const base64Str = await parseImage(newImage);
                    const resp = await axios.put<{ post: PostPage, message: string }>(`/api${location.pathname}`, {
                        newImage: base64Str,
                        imageURL: image.url
                    });

                    setPostData(resp.data.post);
                } else {
                    setErrorMessage(`Image format is unsupported or image size is over ${MAX_FILE_BYTES}.`);
                }
            }
        } catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            setUpdatingImage(false);
        }
    }

    return (
        <div className={`inline-block w-[140px] ${index > 0 ? "ml-3" : ""}`}>
            <div className="w-full h-[85px] relative" onClick={action}>
                <img 
                    className="rounded-[8px] object-contain cursor-pointer w-full h-full
                    bg-[#f5f6f8] border border-very-light-gray absolute top-0 left-0"
                    src={image.url} 
                    alt="" 
                    key={index}
                />
                <AnimatePresence>
                    {updatingImage &&
                    <motion.div className="w-full h-full rounded-[8px] flex items-center gap-2
                    justify-center bg-[#1d1d1db7] absolute top-0 left-0" initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <img src={WhiteLoadingIcon} className="w-[26px] h-[26px]" alt="" />
                        <p className="text-main-white text-[15px]">Updating</p>
                    </motion.div>}
                </AnimatePresence>
            </div>
            {isOwner &&
            <>
                <input type='file' ref={inputFileRef} className="hidden" onChange={uploadImage} />
                <p className="change m-auto mt-3" onClick={triggerFileUpload}>
                    Change
                </p>
            </>}
        </div>
    )
}

export default PostImage;
import { IPostImage } from "../../models/IPostImage";
import { useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { useLocation } from "react-router-dom";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import ErrorPopUp from "../../components/Error/ErrorPopUp";
import LoadingSvg from "../../components/LoadingSvg";
import { PostState } from "./Post";
import { compressImage } from "src/utils/compressImage";
import { ExtendedPostPage } from "./Post";

interface PostImageProps {
    images: IPostImage[],
    index: number,
    isOwner: boolean,
    dispatch: React.Dispatch<Partial<PostState>>,
    action: () => void,
}

function PostImage(props: PostImageProps) {
    const changeImageFileRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [updatingImage, setUpdatingImage] = useState<boolean>(false);
    const [removingImage, setRemovingImage] = useState<boolean>(false);
    const location = useLocation();

    function triggerFileUpload(): void {
        if (changeImageFileRef.current) {
            changeImageFileRef.current.click();
        }
    }

    async function changeImage(): Promise<void> {
        try {
            if (!changeImageFileRef.current || !changeImageFileRef.current.files) {
                return;
            }

            setUpdatingImage(true);
            const compressedImage = await compressImage(changeImageFileRef.current.files[0]);
            const formData = new FormData();

            formData.append("file", compressedImage);
            formData.append("imageURL", props.images[props.index].url);

            const resp = await axios.put<{ post: ExtendedPostPage, message: string }>(`/api${location.pathname}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            props.dispatch({ postData: resp.data.post });
        } catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            setUpdatingImage(false);
        }
    }

    async function removeImage(): Promise<void> {
        try {
            setRemovingImage(true);
            const resp = await axios.delete<{ updatedPost: ExtendedPostPage, message: string }>
            (`/api${location.pathname}/${props.images[props.index].cloudinaryID}`);

            props.dispatch({
                index: props.images.length - 2,
                postData: resp.data.updatedPost
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            setRemovingImage(false);
        }
    }

    return (
        <div className={`inline-block w-[140px] ${props.index > 0 ? "ml-3" : ""}`}>
            <AnimatePresence>
                {errorMessage !== "" &&
                <ErrorPopUp
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />}
            </AnimatePresence>
            <div className="w-full h-[85px] relative" onClick={props.action}>
                <img 
                    className="rounded-[8px] object-contain cursor-pointer w-full h-full
                    bg-very-light-gray border border-light-border-gray absolute top-0 left-0"
                    src={props.images[props.index].url} 
                    alt="" 
                    key={props.index}
                />
                <AnimatePresence>
                    {(updatingImage || removingImage) &&
                    <motion.div className="w-full h-full rounded-[8px] flex items-center gap-2
                    justify-center bg-[#1d1d1db7] absolute top-0 left-0" initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <LoadingSvg size={24} />
                        <p className="text-main-white">
                            {updatingImage ? "Updating" : "Removing"}
                        </p>
                    </motion.div>}
                </AnimatePresence>
            </div>
            {props.isOwner &&
            <>
                <input type='file' ref={changeImageFileRef} className="hidden" onChange={changeImage} />
                <button className="change mt-3 mb-2 w-full" onClick={triggerFileUpload}>
                    Change
                </button>
                {props.images.length > 1 &&
                <button className="cancel-change w-full" onClick={removeImage}>
                    Remove
                </button>}
            </>}
        </div>
    )
}

export default PostImage;
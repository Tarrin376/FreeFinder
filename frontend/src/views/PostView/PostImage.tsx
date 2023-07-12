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
import ErrorPopUp from "../../components/ErrorPopUp";
import { MAX_FILE_UPLOADS } from "../CreatePost/UploadPostFiles";

interface PostImageProps {
    images: IPostImage[],
    index: number,
    isOwner: boolean,
    setPostData: React.Dispatch<React.SetStateAction<PostPage | undefined>>,
    setIndex: React.Dispatch<React.SetStateAction<number>>,
    action: () => void
}

enum Actions {
    UPDATE,
    ADD
}

function PostImage({ images, index, isOwner, setPostData, setIndex, action }: PostImageProps) {
    const changeImageFileRef = useRef<HTMLInputElement>(null);
    const addImageFileRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [updatingImage, setUpdatingImage] = useState<boolean>(false);
    const location = useLocation();

    function triggerFileUpload(action: Actions): void {
        if (changeImageFileRef.current && action === Actions.UPDATE) {
            changeImageFileRef.current.click();
        } else if (addImageFileRef.current && action === Actions.ADD) {
            addImageFileRef.current.click();
        }
    }

    async function getImage(ref: React.RefObject<HTMLInputElement>): Promise<unknown | undefined> {
        try {
            if (!ref.current || !ref.current.files) {
                return;
            }

            const newImage = ref.current.files[0];
            const valid = checkFile(newImage, MAX_FILE_BYTES);

            if (valid) {
                const base64Str = await parseImage(newImage);
                return base64Str;
            } else {
                setErrorMessage(`Image format is unsupported or image size is over ${MAX_FILE_BYTES / 1000000}MB.`);
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    async function changeImage(): Promise<void> {
        try {
            setUpdatingImage(true);

            const image = await getImage(changeImageFileRef);
            if (image === undefined) {
                return;
            }

            const resp = await axios.put<{ post: PostPage, message: string }>(`/api${location.pathname}`, {
                newImage: image,
                imageURL: images[index].url
            });

            setPostData(resp.data.post);
        } catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            setUpdatingImage(false);
        }
    }

    async function addImage(): Promise<void> {
        try {
            const image = await getImage(addImageFileRef);
            if (image === undefined) {
                return;
            }

            const resp = await axios.post<{ secure_url: string, message: string }>(`/api${location.pathname}`, {
                image: image,
            });

            const updated = [...images, { url: resp.data.secure_url }];
            setPostData((cur: PostPage | undefined) => {
                if (!cur) return cur;
                return {
                    ...cur,
                    images: updated
                }
            });

            setIndex(updated.length - 1);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    return (
        <>
            <div className={`inline-block w-[140px] ${index > 0 ? "ml-3" : ""}`}>
                <AnimatePresence>
                    {errorMessage !== "" &&
                    <ErrorPopUp
                        errorMessage={errorMessage}
                        setErrorMessage={setErrorMessage}
                    />}
                </AnimatePresence>
                <div className="w-full h-[85px] relative" onClick={action}>
                    <img 
                        className="rounded-[8px] object-contain cursor-pointer w-full h-full
                        bg-[#f5f6f8] border border-very-light-gray absolute top-0 left-0"
                        src={images[index].url} 
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
                    <input type='file' ref={changeImageFileRef} className="hidden" onChange={changeImage} />
                    <p className="change m-auto mt-3" onClick={() => triggerFileUpload(Actions.UPDATE)}>
                        Change
                    </p>
                </>}
            </div>
            {isOwner && images.length < MAX_FILE_UPLOADS &&
            <>
                <input type='file' ref={addImageFileRef} className="hidden" onChange={addImage} />
                <div className={`inline-block absolute w-[140px] ${images.length > 0 ? "ml-3" : ""}`}
                onClick={() => triggerFileUpload(Actions.ADD)}>
                    <button className="change relative w-full h-[85px] flex items-center justify-center rounded-[8px] text-[16px]">
                        + Add image
                    </button>
                </div>
            </>}
        </>
    )
}

export default PostImage;
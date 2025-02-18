import PopUpWrapper from "../../wrappers/PopUpWrapper";
import { useRef } from 'react';
import DragAndDrop from "../../components/File/DragAndDrop";
import Storage from '../../assets/storage.png';
import { CreatePostSections } from "../../enums/CreatePostSections";
import ErrorMessage from "../../components/Error/ErrorMessage";
import { useState } from "react";
import UploadedImage from "./UploadedImage";
import { checkImageType } from "../../utils/checkImageType";
import { checkFiles } from "../../utils/checkFiles";
import { MAX_FILE_BYTES, MAX_SERVICE_IMAGE_UPLOADS, SUPPORTED_IMAGE_FORMATS } from "@freefinder/shared/dist/constants";
import { CreatePostReducerAction } from "./CreatePost";
import { useWindowSize } from "src/hooks/useWindowSize";

interface UploadPostFilesProps {
    dispatch: React.Dispatch<CreatePostReducerAction>
    updatePostServicePopUp: (val: boolean) => void,
    uploadedImages: File[],
    thumbnail: File | undefined
}

function UploadPostFiles({ dispatch, updatePostServicePopUp, uploadedImages, thumbnail }: UploadPostFilesProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const windowSize = useWindowSize();

    async function handleDrop(files: FileList): Promise<void> {
        const { failed, allFiles } = await checkFiles(files, uploadedImages, MAX_FILE_BYTES, MAX_SERVICE_IMAGE_UPLOADS, checkImageType);

        if (failed > 0) {
            setErrorMessage(`Failed to upload ${failed} ${failed === 1 ? "file" : "files"}. Please check that the file formats are 
            supported and that each file does not exceed ${MAX_FILE_BYTES / 1000000}MB in size.`);
        } else {
            setErrorMessage("");
        }

        dispatch({ 
            payload: { uploadedImages: allFiles } 
        });
    }

    function uploadFile(): void {
        if (inputFileRef.current && inputFileRef.current.files) {
            handleDrop(inputFileRef.current.files);
        }
    }

    function triggerFileUpload(): void {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    }

    function deleteImage(image: File): void {
        if (image === thumbnail) {
            dispatch({
                payload: { thumbnail: undefined }
            });
        }

        dispatch({ 
            payload: { uploadedImages: uploadedImages.filter((x) => x !== image) } 
        });
    }

    return (
        <PopUpWrapper setIsOpen={updatePostServicePopUp} title="Upload post images" firstChildStyles="pb-0">
            <div>
                <DragAndDrop handleDrop={handleDrop}>
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <img src={Storage} className="block m-auto w-[50px] h-[50px] mb-3" alt="storage" />
                        <p className="text-center">Drag and Drop files here or</p>
                        <p className="underline cursor-pointer text-center" onClick={triggerFileUpload}>Choose file</p>
                    </div>
                </DragAndDrop>
                <div className={`flex mt-5 ${windowSize < 450 ? "flex-col" : "items-center justify-between"}`}>
                    <p className="text-side-text-gray">Supported formats: {SUPPORTED_IMAGE_FORMATS.join(", ")}</p>
                    <p className="text-side-text-gray mt-[2px]">{`Max size: ${MAX_FILE_BYTES / 1000000}MB`}</p>
                </div>
                <p className="text-side-text-gray mt-[2px] mb-5">Files uploaded:
                    <span className={uploadedImages.length === MAX_SERVICE_IMAGE_UPLOADS ? 'text-error-text' : 'text-light-green'}>
                        {` ${uploadedImages.length} / ${MAX_SERVICE_IMAGE_UPLOADS}`}
                    </span>
                </p>
                {errorMessage !== "" && 
                <ErrorMessage 
                    message={errorMessage} 
                    title="Unable to upload some of your files"
                    setErrorMessage={setErrorMessage}
                    styles="mt-4"
                />}
                {uploadedImages.length > 0 &&
                <div className="max-h-[250px] items-center overflow-y-scroll pr-[8px] flex flex-col gap-[15px] my-5">
                    {uploadedImages.map((image: File, index: number) => {
                        return (
                            <UploadedImage file={image} key={index} description="You can download this file to verify that it is the correct one.">
                                <a href={URL.createObjectURL(image)} download={image.name}>
                                    <button className="side-btn w-full">
                                        Download
                                    </button>
                                </a>
                                <button className="red-btn w-full" onClick={() => deleteImage(image)}>
                                    Remove
                                </button>
                            </UploadedImage>
                        );
                    })}
                </div>}
            </div>
            <div className="flex gap-3 ml-auto w-fit">
                <input type="file" ref={inputFileRef} className="hidden" onChange={uploadFile} />
                <button className="side-btn w-[110px]" onClick={() => updatePostServicePopUp(false)}>
                    Cancel
                </button>
                <button 
                className={`btn-primary bg-main-blue hover:bg-main-blue-hover text-main-white w-[110px] px-3 
                ${uploadedImages.length === 0 ? 'invalid-button' : ''}`}
                disabled={uploadedImages.length === 0}
                onClick={() => dispatch({ 
                    payload: { section: CreatePostSections.ChooseThumbnail } 
                })}>
                    Next
                </button>
            </div>
        </PopUpWrapper>
    )
}

export default UploadPostFiles;
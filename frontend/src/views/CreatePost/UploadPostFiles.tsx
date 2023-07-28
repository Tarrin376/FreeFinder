import PopUpWrapper from "../../wrappers/PopUpWrapper";
import { useRef } from 'react';
import DragAndDrop from "../../components/DragAndDrop";
import Storage from '../../assets/storage.png';
import { Sections } from "../../enums/Sections";
import ErrorMessage from "../../components/ErrorMessage";
import { useState } from "react";
import UploadedImage from "../../components/UploadedImage";
import { getUniqueArray } from "../../utils/getUniqueArray";
import { checkImageType } from "../../utils/checkImageType";
import { FileData } from "../../types/FileData";
import { parseFiles } from "../../utils/parseFiles";

export const MAX_FILE_UPLOADS = 20;
export const MAX_FILE_BYTES = 2000000;

interface UploadPostFilesProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setUploadedImages: React.Dispatch<React.SetStateAction<FileData[]>>,
    uploadedImages: FileData[],
    thumbnail: FileData | undefined,
    setThumbnail: React.Dispatch<React.SetStateAction<FileData | undefined>>
}

function UploadPostFiles({ setPostService, setSection, uploadedImages, setUploadedImages, thumbnail, setThumbnail }: UploadPostFilesProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function handleDrop(files: FileList): Promise<void> {
        const { failed, allFiles } = await parseFiles(files, uploadedImages, MAX_FILE_BYTES, MAX_FILE_UPLOADS, checkImageType);

        if (failed > 0) {
            setErrorMessage(`Failed to upload ${failed} ${failed === 1 ? "file" : "files"}. Please check that the file formats are 
            supported and that each file does not exceed ${MAX_FILE_BYTES / 1000000}MB in size.`);
        } else {
            setErrorMessage("");
        }

        setUploadedImages([...getUniqueArray<FileData, unknown>(allFiles, (x: FileData) => x.base64Str)]);
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

    function deleteImage(image: FileData): void {
        if (image === thumbnail) setThumbnail(undefined);
        setUploadedImages((state) => state.filter((x) => x !== image));
    }

    return (
        <PopUpWrapper setIsOpen={setPostService} title="Upload post images">
            <DragAndDrop handleDrop={handleDrop}>
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <img src={Storage} className="block m-auto w-[50px] h-[50px] mb-3" alt="storage" />
                    <p className="text-center">Drag and Drop files here or</p>
                    <p className="underline cursor-pointer text-center" onClick={triggerFileUpload}>Choose file</p>
                </div>
            </DragAndDrop>
            <div className="flex items-center justify-between mt-3">
                <p className="text-side-text-gray">Supported formats: PNG, JPG</p>
                <p className="text-side-text-gray">{`Maximum size: ${MAX_FILE_BYTES / 1000000}MB`}</p>
            </div>
            <p className="text-side-text-gray mt-3 mb-4">Files uploaded:
                <span className={uploadedImages.length === MAX_FILE_UPLOADS ? 'text-error-text' : 'text-light-green'}>
                    {` ${uploadedImages.length} / ${MAX_FILE_UPLOADS}`}
                </span>
            </p>
            {errorMessage !== "" && 
            <ErrorMessage 
                message={errorMessage} 
                title="Unable to upload some of your files."
                setErrorMessage={setErrorMessage}
            />}
            <div className="max-h-[250px] items-center overflow-y-scroll mt-6 pr-[8px] flex flex-col gap-[15px]">
                {uploadedImages.map((image: FileData, index: number) => {
                    return (
                        <UploadedImage file={image.file} key={index} description="You can download this file to verify that it is the correct one.">
                            <a href={URL.createObjectURL(image.file)} download={image.file.name}>
                                <button className="side-btn w-[120px]">
                                    Download
                                </button>
                            </a>
                            <button className="red-btn w-[120px]" onClick={() => deleteImage(image)}>
                                Remove
                            </button>
                        </UploadedImage>
                    );
                })}
            </div>
            <div className="mt-[35px] flex gap-3 ml-auto w-fit">
                <input type="file" ref={inputFileRef} className="hidden" onChange={uploadFile} />
                <button className="side-btn w-[110px]" onClick={() => setPostService(false)}>
                    Cancel
                </button>
                <button className={`btn-primary bg-main-blue hover:bg-main-blue-hover text-main-white w-[110px] px-3 
                ${uploadedImages.length === 0 ? 'invalid-button' : ''}`}
                onClick={() => setSection(Sections.ChooseThumbnail)} disabled={uploadedImages.length === 0}>
                    Next
                </button>
            </div>
        </PopUpWrapper>
    )
}

export default UploadPostFiles;
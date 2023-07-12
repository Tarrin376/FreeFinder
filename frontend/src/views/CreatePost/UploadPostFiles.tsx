import PopUpWrapper from "../../wrappers/PopUpWrapper";
import { useRef } from 'react';
import DragAndDrop from "../../components/DragAndDrop";
import Storage from '../../assets/storage.png';
import { Sections } from "../../enums/Sections";
import ErrorMessage from "../../components/ErrorMessage";
import { useState } from "react";
import File from "../../components/File";
import { getUniqueArray } from "../../utils/getUniqueArray";
import { ImageData } from "../../types/ImageData";
import { parseImage } from "../../utils/parseImage";
import { checkFile } from "../../utils/checkFile";

export const MAX_FILE_UPLOADS: number = 20;
export const MAX_FILE_BYTES = 2000000;

interface UploadPostFilesProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setUploadedImages: React.Dispatch<React.SetStateAction<ImageData[]>>,
    uploadedImages: ImageData[],
    thumbnail: ImageData | undefined,
    setThumbnail: React.Dispatch<React.SetStateAction<ImageData | undefined>>
}

function UploadPostFiles({ setPostService, setSection, uploadedImages, setUploadedImages, thumbnail, setThumbnail }: UploadPostFilesProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function handleDrop(files: FileList): Promise<void> {
        let filesToAdd: number = Math.min(MAX_FILE_UPLOADS - uploadedImages.length, files.length);
        const uploaded: ImageData[] = [];
        let index = 0;
        let failed = 0;

        while (index < files.length && filesToAdd > 0) {
            const validFile: boolean = checkFile(files[index], MAX_FILE_BYTES);
            if (validFile) {
                const parsedImage = await parseImage(files[index]);
                uploaded.push({
                    file: files[index],
                    image: parsedImage
                });
                filesToAdd--;
            } else {
                failed++;
            }

            index++;
        }

        if (failed > 0) {
            setErrorMessage(`Failed to upload ${failed} ${failed === 1 ? "file" : "files"}. Please check that the file formats are 
            supported and that each file does not exceed ${MAX_FILE_BYTES / 1000000}MB in size.`);
        } else {
            setErrorMessage("");
        }

        const allFiles = [...uploadedImages, ...getUniqueArray<ImageData, unknown>(uploaded, (x: ImageData) => x.image)];
        setUploadedImages([...getUniqueArray<ImageData, unknown>(allFiles, (x: ImageData) => x.image)]);
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

    function deleteImage(image: ImageData): void {
        if (image === thumbnail) setThumbnail(undefined);
        setUploadedImages((state) => state.filter((x) => x !== image));
    }

    return (
        <PopUpWrapper setIsOpen={setPostService} title="Upload post images">
            <DragAndDrop handleDrop={handleDrop}>
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <img src={Storage} className="block m-auto w-[50px] h-[50px] mb-3" alt="storage" />
                    <p className="text-center">Drag and Drop file here or</p>
                    <p className="underline cursor-pointer text-center" onClick={triggerFileUpload}>Choose file</p>
                </div>
            </DragAndDrop>
            <div className="flex items-center justify-between mt-3">
                <p className="text-side-text-gray">Supported formats: PNG, JPG</p>
                <p className="text-side-text-gray">{`Maximum size: ${MAX_FILE_BYTES / 1000000}MB`}</p>
            </div>
            <p className="text-side-text-gray mt-3 mb-4">Files uploaded:
                <span className={uploadedImages.length === MAX_FILE_UPLOADS ? 'text-error-text' : 'text-[#36BF54]'}>
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
                {uploadedImages.map((image: ImageData, index: number) => {
                    return (
                        <File file={image.file} key={index} description="You can download this file to verify that it is the correct one.">
                            <a href={URL.createObjectURL(image.file)} download={image.file.name}>
                                <button className="side-btn w-[140px]">
                                    Download
                                </button>
                            </a>
                            <button className="bg-error-red text-error-text btn-primary w-[140px] px-3
                            hover:bg-error-red-hover" onClick={() => deleteImage(image)}>
                                Remove
                            </button>
                        </File>
                    );
                })}
            </div>
            <div className="mt-[35px] flex gap-3 ml-auto w-fit">
                <input type='file' ref={inputFileRef} className="hidden" onChange={uploadFile} />
                <button className="bg-main-white border-2 border-light-border-gray btn-primary w-[110px] px-3
                hover:bg-main-white-hover" onClick={() => setPostService(false)}>
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
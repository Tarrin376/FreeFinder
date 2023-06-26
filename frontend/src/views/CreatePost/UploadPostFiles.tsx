import PopUpWrapper from "../../layouts/PopUpWrapper";
import { useRef } from 'react';
import DragAndDrop from "../../components/DragAndDrop";
import Storage from '../../assets/storage.png';
import { Sections } from "./CreatePost";
import ErrorMessage from "../../components/ErrorMessage";
import { useState } from "react";
import File from "../../components/File";

const MAX_FILE_UPLOADS: number = 20;
const MAX_FILE_BYTES = 5000000;

interface UploadPostFilesProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>,
    uploadedFiles: File[],
}

function UploadPostFiles({ setPostService, setSection, uploadedFiles, setUploadedFiles }: UploadPostFilesProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    function checkFile(file: File): boolean {
        return (file.type === "image/jpeg" || file.type === "image/png") && file.size <= MAX_FILE_BYTES;
    }

    function handleDrop(files: FileList): void {
        let filesToAdd: number = Math.min(MAX_FILE_UPLOADS - uploadedFiles.length, files.length);
        const uploaded: File[] = [];
        let index = 0;
        let failed = 0;

        while (index < files.length && filesToAdd > 0) {
            const validFile: boolean = checkFile(files[index]);
            if (validFile) {
                uploaded.push(files[index]);
                filesToAdd--;
            } else {
                failed++;
            }

            index++;
        }

        if (failed > 0) {
            setErrorMessage(`Failed to upload ${failed} ${failed === 1 ? "file" : "files"}. 
            Please check that they are in one of the supported formats.`);
        } else {
            setErrorMessage("");
        }

        setUploadedFiles((state) => [...state, ...uploaded]);
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

    function deleteFile(file: File): void {
        setUploadedFiles((state) => state.filter((x) => x !== file));
    }

    return (
        <PopUpWrapper setIsOpen={setPostService} title={"Upload post images"}>
            <DragAndDrop handleDrop={handleDrop}>
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <img src={Storage} className="block m-auto w-[50px] h-[50px] mb-3" alt="storage" />
                    <p className="text-center">
                        Drag and Drop file here or
                        <span className="underline font-semibold cursor-pointer" onClick={triggerFileUpload}> Choose file</span>
                    </p>
                </div>
            </DragAndDrop>
            <div className="flex items-center justify-between mt-3">
                <p className="text-side-text-gray">Supported formats: PNG, JPG</p>
                <p className="text-side-text-gray">Maximum size: 5MB</p>
            </div>
            <p className="text-side-text-gray mt-3 mb-4">Files uploaded:
                <span className={uploadedFiles.length === MAX_FILE_UPLOADS ? 'text-error-red' : 'text-[#36BF54]'}>
                    {` ${uploadedFiles.length} / ${MAX_FILE_UPLOADS}`}
                </span>
            </p>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} title="There was a problem uploading some of your files." />}
            <div className="max-h-[250px] items-center overflow-y-scroll mt-6 flex flex-col gap-[15px] scrollbar-hide">
                {uploadedFiles.map((file: File, index: number) => {
                    return (
                        <File file={file} key={index} description="You can download this file to verify that it is the correct one.">
                            <a href={URL.createObjectURL(file)} download={file.name}>
                                <button className="bg-main-white border-2 border-light-gray btn-primary w-[120px] px-3
                                hover:bg-main-white-hover">
                                    Download
                                </button>
                            </a>
                            <button className="bg-error-red text-error-text btn-primary w-[120px] px-3
                            hover:bg-error-red-hover" onClick={() => deleteFile(file)}>
                                Remove
                            </button>
                        </File>
                    );
                })}
            </div>
            <div className="mt-[35px] flex gap-3 ml-auto w-fit">
                <input type='file' ref={inputFileRef} className="hidden" onChange={uploadFile} />
                <button className="bg-main-white border-2 border-light-gray btn-primary w-[110px] px-3
                hover:bg-main-white-hover" onClick={() => setPostService(false)}>
                    Cancel
                </button>
                <button className={`btn-primary bg-main-blue hover:bg-main-blue-hover text-main-white w-[110px] px-3 
                ${uploadedFiles.length === 0 ? 'invalid-button' : ''}`}
                onClick={() => setSection(Sections.ChooseThumbnail)} disabled={uploadedFiles.length === 0}>
                    Next
                </button>
            </div>
        </PopUpWrapper>
    )
}

export default UploadPostFiles;
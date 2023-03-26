import PopUpWrapper from "../../layouts/PopUpWrapper";
import { useRef } from 'react';
import DragAndDrop from "../../components/DragAndDrop";
import Storage from '../../assets/storage.png';
import PNGIcon from '../../assets/png.png';
import JPGIcon from '../../assets/jpg.png';
import { Sections } from "./CreatePost";

const MAX_FILE_UPLOADS: number = 20;
const MAX_FILE_BYTES = 26214400;

interface UploadPostFilesProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>,
    uploadedFiles: File[],
}

function UploadPostFiles({ setPostService, setSection, uploadedFiles, setUploadedFiles }: UploadPostFilesProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);

    function checkFile(file: File): boolean {
        return (file.type === "image/jpeg" || file.type === "image/png") && file.size <= MAX_FILE_BYTES;
    }

    function handleDrop(files: FileList): void {
        let filesToAdd: number = Math.min(MAX_FILE_UPLOADS - uploadedFiles.length, files.length);
        const uploaded: File[] = [];
        let index = 0;

        while (index < files.length && filesToAdd > 0) {
            const validFile: boolean = checkFile(files[index]);
            if (validFile) {
                uploaded.push(files[index]);
                filesToAdd--;
            }

            index++;
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
        <PopUpWrapper setIsOpen={setPostService} title={"Upload files"}>
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
                <p className="text-side-text-gray">Maximum size: 25MB</p>
            </div>
            <p className="text-side-text-gray mt-3">Files uploaded:
                <span className={uploadedFiles.length === MAX_FILE_UPLOADS ? 'text-error-red' : 'text-[#36BF54]'}>
                    {` ${uploadedFiles.length} / ${MAX_FILE_UPLOADS}`}
                </span>
            </p>
            <div className="max-h-[250px] items-center overflow-scroll mt-6 flex flex-col gap-[15px] scrollbar-hide">
                {uploadedFiles.map((file: File, index: number) => {
                    return (
                        <div key={index} className="p-3 rounded-[8px] bg-[#f8f9fa] flex justify-between gap-[18px] items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={file.type === "image/jpeg" ? JPGIcon : PNGIcon} alt="file type" className="w-[32px] h-[32px]" />
                                    <p>{file.name}</p>
                                </div>
                                <p className="text-side-text-gray text-[15px]">
                                    You can download this file to verify that it is the correct one.
                                </p>
                            </div>
                            <div className="flex flex-col gap-[10px]">
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
                            </div>
                        </div>
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
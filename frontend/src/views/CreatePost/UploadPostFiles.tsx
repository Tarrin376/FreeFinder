import PopUpWrapper from "../../layouts/PopUpWrapper";
import { useRef } from 'react';
import DragAndDrop from "../../components/DragAndDrop";
import Storage from '../../assets/storage.png';
import PNGIcon from '../../assets/png.png';
import JPGIcon from '../../assets/jpg.png';
import { Sections } from "../../types/Sections";

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
                {uploadedFiles.map((file: File | undefined, index: number) => {
                    if (!file) {
                        return null;
                    }

                    return (
                        <div key={index} className="px-5 py-3 rounded-[8px] bg-[#f0f2f3] flex justify-between gap-[18px] items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={file.type === "image/jpeg" ? JPGIcon : PNGIcon} alt="file type" className="w-[32px] h-[32px]" />
                                    <p>{file.name}</p>
                                </div>
                                <p className="text-side-text-gray text-[15px]">You can download this file to verify that it is the correct one.</p>
                            </div>
                            <div>
                                <a href={URL.createObjectURL(file)} download={file.name}>
                                    <button className="bg-main-white border-2 border-light-gray btn-primary w-[12s0px] px-3
                                hover:bg-main-white-hover">
                                        Download
                                    </button>
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-[35px] flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer">
                    <svg fill="#879198" width="15px" height="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 416.979 416.979" xmlSpace="preserve">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <g>
                                <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z">
                                </path>
                            </g> 
                        </g>
                    </svg>
                    <p className="text-side-text-gray pb-[1px] select-none">Help Center</p>
                </div>
                <div className="flex gap-3">
                    <input type='file' ref={inputFileRef} className="hidden" onChange={uploadFile} />
                    <button className="bg-main-white border-2 border-light-gray btn-primary w-[110px] px-3
                    hover:bg-main-white-hover" onClick={() => setPostService(false)}>
                        Cancel
                    </button>
                    <button className="btn-primary bg-main-purple hover:bg-main-purple-hover text-main-white w-[110px] px-3"
                    onClick={() => setSection(Sections.PostDetails)}>
                        Next
                    </button>
                </div>
            </div>
        </PopUpWrapper>
    )
}

export default UploadPostFiles;
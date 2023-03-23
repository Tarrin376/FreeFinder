import PopUpWrapper from "../layouts/PopUpWrapper";
import { useState, useContext, useRef } from 'react';
import LoadingButton from "./LoadingButton";
import { UserContext } from "../context/UserContext";
import { IUserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";
import { IListing } from "../models/IListing";
import DragAndDrop from "./DragAndDrop";
import Storage from '../assets/storage.png';
import PNGIcon from '../assets/png.png';
import JPGIcon from '../assets/jpg.png';
import { categories } from "../utils/jobCategories";

const MAX_PRICE: number = 2500;
const MAX_FILE_UPLOADS: number = 20;
const MAX_FILE_BYTES = 26214400;

interface PostServiceProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setUserPosts: React.Dispatch<React.SetStateAction<IListing[]>>,
    setReachedBottom: React.Dispatch<React.SetStateAction<boolean>>,
    setNextPage: React.Dispatch<React.SetStateAction<boolean>>,
    cursor:  React.MutableRefObject<string>
}

interface PostDetailsProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setAbout: React.Dispatch<React.SetStateAction<string>>,
    setTitle: React.Dispatch<React.SetStateAction<string>>, 
    setStartingPrice: React.Dispatch<React.SetStateAction<number>>, 
    createPost: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<any>,
    about: string
    title: string
    startingPrice: number
    errorMessage: string
    loading: boolean,
}

interface UploadPostFilesProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>,
    setThumbnailFile: React.Dispatch<React.SetStateAction<File | undefined>>,
    uploadedFiles: File[],
    thumbnailFile: File | undefined
}

enum Sections {
    PostDetails,
    UploadFiles
}

function CreatePostPopUp({ setPostService, setUserPosts, cursor, setReachedBottom, setNextPage }: PostServiceProps) {
    const [section, setSection] = useState<Sections>(Sections.UploadFiles);
    const [startingPrice, setStartingPrice] = useState<number>(10);
    const [title, setTitle] = useState<string>("");
    const [about, setAbout] = useState<string>("");
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const userContext: IUserContext = useContext(UserContext);

    async function createPost(): Promise<void> {
        setLoading(true);
        
        try {
            const response = await fetch(`/posts/create`, {
                method: 'POST',
                body: JSON.stringify({
                    about: about.trim(),
                    title: title.trim(),
                    startingPrice: startingPrice,
                    userID: userContext.userData.userID
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.status !== 500) {
                const responseData = await response.json();
                if (responseData.message === "success") {
                    setErrorMessage("");
                    setPostService(false);
                    cursor.current = "HEAD";
                    setUserPosts([]);
                    setReachedBottom(false);
                    setNextPage((state) => !state);
                } else {
                    setErrorMessage(responseData.message);
                }
            } else {
                setErrorMessage(`Looks like we are having trouble on our end. Please try again later. 
                (Error code: ${response.status})`);
            }
        }
        catch (err: any) {
            setErrorMessage(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    if (section === Sections.UploadFiles) {
        return (
            <UploadPostFiles 
                setPostService={setPostService} 
                setSection={setSection}
                uploadedFiles={uploadedFiles} 
                setUploadedFiles={setUploadedFiles}
                thumbnailFile={thumbnailFile}
                setThumbnailFile={setThumbnailFile}
            />
        );
    } else {
        return (
            <PostDetails 
                setPostService={setPostService} setSection={setSection}
                setAbout={setAbout} setTitle={setTitle}
                setStartingPrice={setStartingPrice} about={about}
                title={title} startingPrice={startingPrice}
                errorMessage={errorMessage} loading={loading}
                createPost={createPost}
            />
        );
    }
}

function UploadPostFiles({ setPostService, setSection, uploadedFiles, setUploadedFiles, thumbnailFile, setThumbnailFile }: UploadPostFilesProps) {
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

    function updateThumbnail(file: File) {
        setThumbnailFile(file);
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
            <div className="max-h-[250px] overflow-scroll mt-6 flex flex-col gap-[15px] scrollbar-hide">
                {uploadedFiles.map((file: File | undefined, index: number) => {
                    if (!file) {
                        return null;
                    }

                    return (
                        <div key={index} className="px-5 py-3 rounded-[8px] bg-[#f0f2f3] flex justify-between gap-[18px] items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={file.type === "image/jpeg" ? JPGIcon : PNGIcon} alt="file type" className="w-[32px] h-[32px]" />
                                    <p className="font-semibold mb-1">{file.name}</p>
                                </div>
                                <p className="text-side-text-gray text-[15px]">You can download this file to verify that it is the correct one.</p>
                            </div>
                            <div>
                                <a href={URL.createObjectURL(file)} className="block mb-2" download={file.name}>
                                    <button className="bg-main-white border-2 border-light-gray btn-primary w-[140px] px-3 font-semibold
                                hover:bg-main-white-hover">
                                        Download
                                    </button>
                                </a>
                                {file !== thumbnailFile ?
                                <button className="bg-[#212121cc] btn-primary w-[140px] px-3 font-semibold
                                hover:bg-main-black text-main-white" onClick={() => updateThumbnail(file)}>
                                    Set Thumbnail
                                </button> :
                                <button className="action-btn btn-primary w-[140px] px-3 font-semibold">
                                    Thumbnail
                                </button>}
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
                    <button className="bg-main-white border-2 border-light-gray btn-primary w-[110px] px-3 font-semibold
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

function PostDetails({ setPostService, setSection, about, setAbout, title, setTitle, startingPrice, 
    setStartingPrice, errorMessage, loading, createPost }: PostDetailsProps) {
    function validInputs(): boolean {
        return title.trim().length > 0 && about.trim().length > 0 && startingPrice > 0;
    }

    function updateStartingPrice(e: React.ChangeEvent<HTMLInputElement>): void {
        const currencyPattern: RegExp = new RegExp("^[1-9]{1}[0-9]+([.][0-9]{2})?$");
        const price: string = e.target.value;

        if (price.match(currencyPattern) && +price <= MAX_PRICE) {
            setStartingPrice(+price);
        } else {
            setStartingPrice(0);
        }
    }

    return (
        <PopUpWrapper setIsOpen={setPostService} title={"Enter post details"}>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"Unable to create post."} />}
            <h2 className="mb-2">What category does your service fall under?</h2>
            <select className="p-2 search-bar cursor-pointer mb-4">
                {Object.keys(categories).map((category) => <option>{category}</option>)}
            </select>
            <h2 className="mb-2">Starting price (£10 - £2500)</h2>
            <div className="flex items-center search-bar mb-4">
                <p className="select-none">£</p>
                <input type="number" step=".01" min={1} max={2500} defaultValue={startingPrice} className="w-full h-full 
                focus:outline-none placeholder-search-text text-main-black bg-transparent ml-3" onChange={(e) => updateStartingPrice(e)} />
            </div>
            <h2 className="mb-2">Title</h2>
            <input type="text" className="search-bar mb-4" value={title} 
            maxLength={100} placeholder="Enter title" onChange={(e) => setTitle(e.target.value)} />
            <h2 className="mb-2">Write about section</h2>
            <textarea placeholder="Write about your service here" className="w-full search-bar mb-6" value={about}
            onChange={(e) => setAbout(e.target.value)} rows={5} maxLength={1500}></textarea>
            <div className="flex justify-end gap-3 mt-[35px]">
                <button className="bg-main-white border-2 border-light-gray btn-primary w-[110px] px-3 font-semibold
                hover:bg-main-white-hover" onClick={() => setSection(Sections.UploadFiles)}>
                    Back
                </button>
                <LoadingButton
                    loading={loading} text="Post service" loadingText="Creating post..."
                    callback={createPost} styles={`w-[185px] px-3 ${!validInputs() ? "invalid-button" : "btn-primary action-btn"}`}
                    disabled={false} loadingColour="bg-[#36BF54]"
                />
            </div>
        </PopUpWrapper>
    );
}

export default CreatePostPopUp;
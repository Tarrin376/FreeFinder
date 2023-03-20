import PopUpWrapper from "../layouts/PopUpWrapper";
import { useState, useContext, useRef } from 'react';
import LoadingButton from "./LoadingButton";
import { UserContext } from "../context/UserContext";
import { IUserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";
import { IPost } from "../models/IPost";
import DragAndDrop from "./DragAndDrop";
import Storage from '../assets/storage.png';
import PNGIcon from '../assets/png.png';
import JPGIcon from '../assets/jpg.png';

const MAX_PRICE: number = 2500;

interface PostServiceProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setUserPosts: React.Dispatch<React.SetStateAction<IPost[]>>,
    setReachedBottom: React.Dispatch<React.SetStateAction<boolean>>,
    setNextPage: React.Dispatch<React.SetStateAction<boolean>>,
    cursor:  React.MutableRefObject<string>
}

interface PostDetailsProps extends PostServiceProps {
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setAbout: React.Dispatch<React.SetStateAction<string>>,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    setStartingPrice: React.Dispatch<React.SetStateAction<number>>,
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>,
    about: string,
    title: string,
    startingPrice: number,
    uploadedFiles: File[]
}

interface UploadPostFilesProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>,
    uploadedFiles: File[]
}

enum Sections {
    PostDetails,
    UploadFiles
}

function PostServicePopUp({ setPostService, setUserPosts, cursor, setReachedBottom, setNextPage }: PostServiceProps) {
    const [section, setSection] = useState<Sections>(Sections.UploadFiles);
    const [startingPrice, setStartingPrice] = useState<number>(10);
    const [title, setTitle] = useState<string>("");
    const [about, setAbout] = useState<string>("");
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    if (section === Sections.UploadFiles) {
        return (
            <UploadPostFiles 
                setPostService={setPostService} 
                setSection={setSection}
                uploadedFiles={uploadedFiles} 
                setUploadedFiles={setUploadedFiles} 
            />
        );
    } else {
        return (
            <PostDetails 
                setPostService={setPostService} setUserPosts={setUserPosts} 
                cursor={cursor} setReachedBottom={setReachedBottom} 
                setNextPage={setNextPage} setSection={setSection}
                about={about} setAbout={setAbout} 
                title={title} setTitle={setTitle}
                startingPrice={startingPrice} setStartingPrice={setStartingPrice}
                uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} 
            />
        );
    }
}

function UploadPostFiles({ setPostService, setSection, uploadedFiles, setUploadedFiles }: UploadPostFilesProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const inputFileRef = useRef<HTMLInputElement>(null);

    function handleDrop(file: File) {
        if (uploadedFiles.length === 20) {
            setErrorMessage("You have reached your maximum limit of 20 images. If you would like to upload this image, please delete an image from your list.");
        } else if (file.type !== "image/jpeg" && file.type !== "image/png") {
            setErrorMessage("This image is not in the list of supported formats. Please change the format of the image or upload something else.");
        } else if (file.size > 26214400) {
            setErrorMessage("The file size of this image is too large, please compress this image or upload something else.");
        } else {
            setUploadedFiles((state) => [...state, file]);
            setErrorMessage("");
        }
    }

    function uploadFile() {
        if (inputFileRef.current) {
            setUploadedFiles((state) => [...state, inputFileRef.current!.files![0]]);
        }
    }

    function triggerFileUpload() {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    }

    return (
        <PopUpWrapper setIsOpen={setPostService} title={"Upload files"}>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"Unable to upload image"} />}
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
            <div className="max-h-[250px] overflow-scroll mt-6 flex flex-col gap-[15px] scrollbar-hide">
                {uploadedFiles.map((file: File) => {
                    return (
                        <div className="px-5 py-3 rounded-[8px] bg-[#f0f2f3] flex justify-between gap-[18px] items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={file.type === "image/jpeg" ? JPGIcon : PNGIcon} alt="file type" className="w-[32px] h-[32px]" />
                                    <p className="font-semibold mb-1">{file.name}</p>
                                </div>
                                <p className="text-side-text-gray text-[15px]">You can download this file to verify that it is the correct one.</p>
                            </div>
                            <a href={URL.createObjectURL(file)} download={file.name}>
                                <button className="bg-main-white border-2 border-light-gray btn-primary w-[110px] px-3 font-semibold
                              hover:bg-main-white-hover">
                                    Download
                                </button>
                            </a>
                        </div>
                    );
                })}
            </div>
            <div className="mt-[35px] flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer">
                    <svg fill="#879198" width="15px" height="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
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
                    hover:bg-main-white-hover">
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

function PostDetails({ setPostService, setUserPosts, cursor, setReachedBottom, setNextPage, setSection,
    about, setAbout, title, setTitle, startingPrice, setStartingPrice }: PostDetailsProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const userContext: IUserContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function createPost(): Promise<void> {
        setLoading(true);
        
        try {
            const create = await fetch(`/post/createPost`, {
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
            }).then((res) => {
                return res.json();
            });

            if (create.message === "success") {
                setErrorMessage("");
                setPostService(false);
                cursor.current = "HEAD";
                setUserPosts([]);
                setNextPage((state) => !state);
                setReachedBottom(false);
            } else {
                setErrorMessage(create.message);
            }
        }
        catch (err: any) {
            setErrorMessage(err.message);
        }
        finally {
            setLoading(false);
        }
    }

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
            <h2 className="mb-2">Starting price (£10 - £2500)</h2>
            <div className="flex items-center search-bar mb-4">
                <p className="select-none">£</p>
                <input type="number" step=".01" min={1} max={2500} defaultValue={startingPrice} className="w-full h-full 
                focus:outline-none placeholder-search-text text-main-black bg-transparent ml-3" onChange={(e) => updateStartingPrice(e)} />
            </div>
            <p className="mb-1">Title</p>
            <input type="text" className="search-bar mb-4" value={title} 
            maxLength={38} placeholder="Enter title" onChange={(e) => setTitle(e.target.value)} />
            <p className="mb-1">Write about section</p>
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

export default PostServicePopUp;
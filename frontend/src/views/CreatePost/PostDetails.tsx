import PopUpWrapper from "../../layouts/PopUpWrapper";
import ErrorMessage from "../../components/ErrorMessage";
import { categories } from "../../utils/jobCategories";
import { Sections } from "./CreatePost";
import { FailedUpload } from "../../types/FailedUploaded";
import { useState } from "react";
import File from "../../components/File";
import Button from "../../components/Button";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";

interface PostDetailsProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setAbout: React.Dispatch<React.SetStateAction<string>>,
    setTitle: React.Dispatch<React.SetStateAction<string>>, 
    createPost: () => Promise<string | undefined>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setFailedUploads: React.Dispatch<React.SetStateAction<FailedUpload[]>>,
    about: string,
    title: string,
    errorMessage: string,
    failedUploads: FailedUpload[],
    postID: string
}

function PostDetails(props: PostDetailsProps) {
    const [showFailedUploads, setShowFailedUploads] = useState<boolean>(false);

    function validInputs(): boolean {
        return props.title.trim().length > 0 && props.about.trim().length > 0;
    }

    function toggleFailedUploads() {
        setShowFailedUploads((cur) => !cur);
    }

    async function retryFileUpload(upload: FailedUpload): Promise<string | undefined> {
        try {
            await axios.post(`/api/posts/${props.postID}`, {
                isThumbnail: false,
                image: upload.imageData.image,
                imageNum: upload.index
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    function ignoreUpload(upload: FailedUpload) {
        if (props.failedUploads.length === 1) props.setErrorMessage("");
        props.setFailedUploads((cur) => cur.filter((x: FailedUpload) => x.imageData.image !== upload.imageData.image));
    }

    return (
        <PopUpWrapper setIsOpen={props.setPostService} title={"Enter post details"}>
            {props.errorMessage !== "" && 
            <ErrorMessage 
                message={props.errorMessage} 
                title={"Failed to complete action."} 
                styles="!mb-6"
            />}
            {props.failedUploads.length > 0 && 
            <p className="text-main-blue mb-6 underline cursor-pointer" onClick={toggleFailedUploads}>
                {showFailedUploads ? "Hide all failed images" : "View all failed images"}
            </p>}
            {showFailedUploads && props.failedUploads.length > 0 && 
            <div className="max-h-[250px] items-center overflow-y-scroll mt-6 flex flex-col gap-[15px] scrollbar-hide">
                {props.failedUploads.map((upload: FailedUpload, index: number) => {
                    return (
                        <File file={upload.imageData.file} key={index} description={upload.errorMessage} error={true}>
                            <button className="bg-main-white border-2 border-light-gray btn-primary w-[120px] px-3
                            hover:bg-main-white-hover" onClick={() => ignoreUpload(upload)}>
                                Ignore
                            </button>
                            <Button
                                action={() => retryFileUpload(upload)}
                                completedText="Uploaded"
                                defaultText="Retry"
                                loadingText="Retrying"
                                styles="red-btn w-[120px] px-3"
                                textColor="text-error-text"
                                hideLoadingIcon={true}
                                setErrorMessage={props.setErrorMessage}
                                whenComplete={() => ignoreUpload(upload)}
                            />
                        </File>
                    )
                })}
            </div>}
            <h3 className="mb-2 mt-6">What category does your service fall under?</h3>
            <select className="p-2 search-bar cursor-pointer mb-4">
                {Object.keys(categories).map((category, index) => {
                    return (
                        <option key={index}>
                            {category}
                        </option>
                    )
                })}
            </select>
            <h3 className="mb-2">Title</h3>
            <input 
                type="text" 
                className="search-bar mb-4" 
                value={props.title} 
                maxLength={100} 
                placeholder="Enter title" 
                onChange={(e) => props.setTitle(e.target.value)} 
            />
            <h3 className="mb-2">Write about section</h3>
            <textarea 
                placeholder="Write about your service here" 
                className="w-full search-bar mb-6" 
                value={props.about}
                onChange={(e) => props.setAbout(e.target.value)} 
                rows={5} 
                maxLength={1500} 
            />
            <div className="flex justify-end gap-3 mt-8">
                <button className="side-btn" onClick={() => props.setSection(Sections.BasicPackage)}>
                    Back
                </button>
                <Button
                    action={props.createPost}
                    completedText="Post created"
                    defaultText="Post service"
                    loadingText="Creating post"
                    styles={`w-[185px] ${!validInputs() ? "invalid-button" : "main-btn !h-[42px]"}`}
                    textColor="text-main-white"
                    setErrorMessage={props.setErrorMessage}
                />
            </div>
        </PopUpWrapper>
    );
}

export default PostDetails;
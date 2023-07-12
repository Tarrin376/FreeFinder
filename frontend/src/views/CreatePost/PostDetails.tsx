import PopUpWrapper from "../../wrappers/PopUpWrapper";
import ErrorMessage from "../../components/ErrorMessage";
import { categories } from "../../utils/jobCategories";
import { Sections } from "../../enums/Sections";
import { FailedUpload } from "../../types/FailedUploaded";
import { useState } from "react";
import File from "../../components/File";
import Button from "../../components/Button";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import TextEditor from "../../components/TextEditor";

interface PostDetailsProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setAbout: React.Dispatch<React.SetStateAction<string>>,
    setTitle: React.Dispatch<React.SetStateAction<string>>, 
    createPost: () => Promise<string | undefined>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setFailedUploads: React.Dispatch<React.SetStateAction<FailedUpload[]>>,
    setCreatedPost: React.Dispatch<React.SetStateAction<boolean>>,
    about: string,
    title: string,
    errorMessage: string,
    failedUploads: FailedUpload[],
    postID: string,
    createdPost: boolean
}

export const aboutLimit = 1500;
export const titleLimit = 100;

function PostDetails(props: PostDetailsProps) {
    const [showFailedUploads, setShowFailedUploads] = useState<boolean>(false);

    function validInputs(): boolean {
        return props.title.trim().length > 0 && props.about.trim().length > 0;
    }

    function toggleFailedUploads(): void {
        setShowFailedUploads((cur) => !cur);
    }

    async function retryFileUpload(upload: FailedUpload): Promise<string | undefined> {
        try {
            await axios.post<{ secure_url: string, message: string }>(`/api/posts/${props.postID}`, { 
                image: upload.imageData.image 
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    function ignoreUpload(upload: FailedUpload): void {
        if (props.failedUploads.length === 1) props.setErrorMessage("");
        props.setFailedUploads((cur) => cur.filter((x: FailedUpload) => x.imageData.image !== upload.imageData.image));
    }

    async function deletePost(): Promise<string | undefined> {
        try {
            await axios.delete<{ message: string }>(`/api/posts/${props.postID}`);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    return (
        <PopUpWrapper setIsOpen={props.setPostService} title="Enter post details">
            {props.errorMessage !== "" && 
            <ErrorMessage 
                message={props.errorMessage} 
                title="Failed to complete action."
                styles="!mb-6"
                setErrorMessage={props.setErrorMessage}
            />}
            {props.failedUploads.length > 0 && 
            <p className="text-main-blue mb-6 underline cursor-pointer" onClick={toggleFailedUploads}>
                {showFailedUploads ? "Hide all failed images" : "View all failed images"}
            </p>}
            {showFailedUploads && props.failedUploads.length > 0 && 
            <div className="max-h-[250px] items-center overflow-y-scroll mt-6 pr-[8px] flex flex-col gap-[15px]">
                {props.failedUploads.map((upload: FailedUpload, index: number) => {
                    return (
                        <File file={upload.imageData.file} key={index} description={upload.errorMessage} error={true}>
                            <button className="bg-main-white border-2 border-light-border-gray btn-primary min-w-[120px] px-3
                            hover:bg-main-white-hover" onClick={() => ignoreUpload(upload)}>
                                Ignore
                            </button>
                            <Button
                                action={() => retryFileUpload(upload)}
                                completedText="Uploaded"
                                defaultText="Retry"
                                loadingText="Retrying"
                                styles="red-btn w-[140px] px-3"
                                textStyles="text-error-text"
                                setErrorMessage={props.setErrorMessage}
                                whenComplete={() => ignoreUpload(upload)}
                                redLoadingIcon={true}
                            />
                        </File>
                    )
                })}
            </div>}
            <h3 className="mb-2 mt-6">What category does your service fall under?</h3>
            <select className="search-bar cursor-pointer mb-4">
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
                maxLength={titleLimit} 
                placeholder="Enter title" 
                onChange={(e) => props.setTitle(e.target.value)} 
            />
            <h3 className="mb-2">Write about section</h3>
            <TextEditor
                value={props.about}
                setValue={props.setAbout}
                limit={aboutLimit}
            />
            <div className="flex justify-end gap-3 mt-8">
                <button className="side-btn w-[110px]" onClick={() => props.setSection(Sections.BasicPackage)}>
                    Back
                </button>
                {props.createdPost ?
                <Button 
                    action={deletePost}
                    completedText="Post deleted"
                    defaultText="Delete post"
                    loadingText="Deleting post"
                    styles="red-btn btn-primary"
                    textStyles="text-error-text"
                    setErrorMessage={props.setErrorMessage}
                    whenComplete={() => props.setPostService(false)}
                    redLoadingIcon={true}
                /> :
                <Button
                    action={props.createPost}
                    completedText="Post created"
                    defaultText="Post service"
                    loadingText="Creating post"
                    styles={`min-w-[185px] w-fit ${!validInputs() ? "invalid-button" : "main-btn !h-[42px]"}`}
                    textStyles="text-main-white"
                    setErrorMessage={props.setErrorMessage}
                    whenComplete={() => props.setCreatedPost(true)}
                />}
            </div>
        </PopUpWrapper>
    );
}

export default PostDetails;
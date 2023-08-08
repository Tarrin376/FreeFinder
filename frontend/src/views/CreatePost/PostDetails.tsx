import PopUpWrapper from "../../wrappers/PopUpWrapper";
import ErrorMessage from "../../components/ErrorMessage";
import { Sections } from "../../enums/Sections";
import { FailedUpload } from "../../types/FailedUploaded";
import { useState, useEffect } from "react";
import UploadedImage from "../../components/UploadedImage";
import Button from "../../components/Button";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import TextEditor from "../../components/TextEditor";
import { PostPage } from "../../types/PostPage";
import MatchedResults from "../../components/MatchedResults";
import OutsideClickHandler from "react-outside-click-handler";
import { IJobCategory } from "../../models/IJobCategory";
import { getMatchedResults } from "../../utils/getMatchedResults";
import { IWorkType } from "../../models/IWorkType";
import { useFetchJobCategories } from "../../hooks/useFetchJobCategories";
import ErrorPopUp from "../../components/ErrorPopUp";
import { ABOUT_SERVICE_LIMIT, SERVICE_TITLE_LIMIT } from "@freefinder/shared/dist/constants";
import { CreatePostReducerAction } from "./CreatePost";

interface PostDetailsProps {
    dispatch: React.Dispatch<CreatePostReducerAction>,
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    createPost: () => Promise<string | undefined>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    about: string,
    title: string,
    errorMessage: string,
    failedUploads: FailedUpload[],
    postID: string,
    createdPost: boolean,
    jobCategory: string,
    workType: string
}

function PostDetails({ dispatch, jobCategory, setErrorMessage, ...props }: PostDetailsProps) {
    const [showFailedUploads, setShowFailedUploads] = useState<boolean>(false);
    const [matchedWork, setMatchedWork] = useState<string[][]>([]);
    const [hideMatched, setHideMatched] = useState<boolean>(false);
    const jobCategories = useFetchJobCategories();

    function validInputs(): boolean {
        const category = jobCategories.categories.find(x => x.name === jobCategory);
        if (!category) {
            return false;
        }

        return (
            props.title.trim().length > 0 && props.about.trim().length > 0 && 
            category.workTypes.find((x) => x.name === props.workType) !== undefined
        );
    }

    function toggleFailedUploads(): void {
        setShowFailedUploads((cur) => !cur);
    }

    function searchHandler(search: string): void {
        dispatch({
            payload: {
                workType: search
            }
        });

        if (search.trim() === "") {
            setMatchedWork([]);
            return;
        }

        const category = jobCategories.categories.find(x => x.name === jobCategory);
        if (!category) {
            return;
        }

        const matched = getMatchedResults(category.workTypes.map((workType: IWorkType) => workType.name), search);
        setMatchedWork(matched);
    }

    async function retryFileUpload(upload: FailedUpload): Promise<string | undefined> {
        try {
            await axios.post<{ updatedPost: PostPage, message: string }>(`/api/posts/${props.postID}`, { 
                image: upload.fileData.base64Str 
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    function ignoreUpload(upload: FailedUpload): void {
        if (props.failedUploads.length === 1) {
            setErrorMessage("");
        }

        dispatch({
            payload: { failedUploads: props.failedUploads.filter((x: FailedUpload) => x.fileData.base64Str !== upload.fileData.base64Str) }
        });
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

    useEffect(() => {
        dispatch({
            payload: { workType: "" }
        });
    }, [jobCategory, dispatch]);

    useEffect(() => {
        dispatch({
            payload: { jobCategory: jobCategories.categories.length === 0 ? "" : jobCategories.categories[0].name }
        });
    }, [jobCategories.categories, dispatch]);

    return (
        <PopUpWrapper setIsOpen={props.setPostService} title="Enter post details">
            {props.errorMessage !== "" && 
            <ErrorMessage 
                message={props.errorMessage} 
                title="Failed to complete action."
                setErrorMessage={setErrorMessage}
                styles="mb-6"
            />}
            {jobCategories.errorMessage !== "" &&
            <ErrorPopUp
                errorMessage={jobCategories.errorMessage}
                setErrorMessage={jobCategories.setErrorMessage}
            />}
            {props.failedUploads.length > 0 && 
            <p className="text-main-blue mb-6 underline cursor-pointer" onClick={toggleFailedUploads}>
                {showFailedUploads ? "Hide all failed images" : "View all failed images"}
            </p>}
            {showFailedUploads && props.failedUploads.length > 0 && 
            <div className="max-h-[250px] items-center overflow-y-scroll mt-6 pr-[8px] flex flex-col gap-[15px]">
                {props.failedUploads.map((upload: FailedUpload, index: number) => {
                    return (
                        <UploadedImage file={upload.fileData.file} key={index} description={upload.errorMessage} error={true}>
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
                                setErrorMessage={setErrorMessage}
                                whenComplete={() => ignoreUpload(upload)}
                                loadingSvgSize={24}
                                loadingSvgColour="#F43C3C"
                                keepErrorMessage={true}
                            />
                        </UploadedImage>
                    )
                })}
            </div>}
            <h3 className="mb-2 mt-6">What category does your service fall under?</h3>
            <div className="search-bar mb-4">
                <select className={`w-full cursor-pointer rounded-[8px] focus:outline-none 
                ${jobCategories.categories.length === 0 ? "loading" : ""}`} 
                value={jobCategory} onChange={(e) => dispatch({
                    payload: { jobCategory: e.target.value }
                })}>
                    {jobCategories.categories.map((category: IJobCategory, index: number) => {
                        return (
                            <option key={index} value={category.name}>
                                {category.name}
                            </option>
                        )
                    })}
                </select>
            </div>
            <h3 className="mb-2">Your type of work</h3>
            <OutsideClickHandler onOutsideClick={() => setHideMatched(true)}>
                <>
                    <input 
                        type="text" 
                        className={`search-bar ${matchedWork.length > 0 && !hideMatched ? "!rounded-b-none" : ""} focus:!outline-none`}
                        placeholder="Search for your type of work" 
                        value={props.workType}
                        onChange={(e) => searchHandler(e.target.value)}
                        onFocus={() => setHideMatched(false)}
                    />
                    {matchedWork.length > 0 && !hideMatched &&
                    <MatchedResults 
                        search={props.workType}
                        matchedResults={matchedWork}
                        action={(value: string) => {
                            dispatch({
                                payload: { workType: value }
                            });

                            setHideMatched(true);
                            searchHandler(value);
                        }}
                    />}
                </>
            </OutsideClickHandler>
            <h3 className="mb-2 mt-4">Title</h3>
            <input 
                type="text" 
                className="search-bar mb-4" 
                value={props.title} 
                maxLength={SERVICE_TITLE_LIMIT} 
                placeholder="Enter title" 
                onChange={(e) => dispatch({
                    payload: { title: e.target.value }
                })} 
            />
            <h3 className="mb-2">Write about section</h3>
            <TextEditor
                value={props.about}
                limit={ABOUT_SERVICE_LIMIT}
                setValue={(value) => dispatch({
                    payload: { about: value }
                })}
            />
            <div className="flex justify-end gap-3 mt-8">
                <button className="side-btn w-[110px]" onClick={() => dispatch({ 
                    payload: { section: Sections.BasicPackage }
                })}>
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
                    setErrorMessage={setErrorMessage}
                    whenComplete={() => props.setPostService(false)}
                    loadingSvgSize={24}
                    loadingSvgColour="#F43C3C"
                    keepErrorMessage={true}
                /> :
                <Button
                    action={props.createPost}
                    completedText="Post created"
                    defaultText="Post service"
                    loadingText="Creating post"
                    styles={`min-w-[185px] w-fit ${!validInputs() ? "invalid-button" : "main-btn !h-[42px]"}`}
                    textStyles="text-main-white"
                    setErrorMessage={setErrorMessage}
                    loadingSvgSize={24}
                    keepErrorMessage={true}
                    whenComplete={() => dispatch({
                        payload: { createdPost: true }
                    })}
                />}
            </div>
        </PopUpWrapper>
    );
}

export default PostDetails;
import PopUpWrapper from "../../wrappers/PopUpWrapper";
import ErrorMessage from "../../components/Error/ErrorMessage";
import { CreatePostSections } from "../../enums/CreatePostSections";
import { FailedUpload } from "../../types/FailedUpload";
import { useState, useEffect } from "react";
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
import ErrorPopUp from "../../components/Error/ErrorPopUp";
import { ABOUT_SERVICE_LIMIT, SERVICE_TITLE_LIMIT } from "@freefinder/shared/dist/constants";
import { CreatePostReducerAction } from "./CreatePost";
import FailedUploads from "./FailedUploads";
import { compressImage } from "src/utils/compressImage";

interface PostDetailsProps {
    dispatch: React.Dispatch<CreatePostReducerAction>,
    updatePostServicePopUp: (val: boolean) => void,
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
            payload: { workType: search }
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
            const compressedImage = await compressImage(upload.file);
            const formData = new FormData();
            formData.append("file", compressedImage);

            await axios.post<{ updatedPost: PostPage, message: string }>(`/api/posts/${props.postID}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
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
            payload: { 
                failedUploads: props.failedUploads.filter((x: FailedUpload) => x.file !== upload.file)
            }
        });
    }

    async function deletePost(): Promise<string | undefined> {
        try {
            await axios.delete<{ message: string }>(`/api/posts/${props.postID}`);
            props.updatePostServicePopUp(false);
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
        <PopUpWrapper setIsOpen={props.updatePostServicePopUp} title="Enter post details">
            <div>
                {props.errorMessage !== "" && 
                <ErrorMessage 
                    message={props.errorMessage} 
                    title="Failed to create post"
                    setErrorMessage={setErrorMessage}
                />}
                {jobCategories.errorMessage !== "" &&
                <ErrorPopUp
                    errorMessage={jobCategories.errorMessage}
                    setErrorMessage={jobCategories.setErrorMessage}
                />}
                {props.failedUploads.length > 0 && 
                <p className="text-main-blue mb-5 underline cursor-pointer font-bold" onClick={toggleFailedUploads}>
                    {showFailedUploads ? "Hide all failed images" : "View all failed images"}
                </p>}
                {showFailedUploads && props.failedUploads.length > 0 && 
                <FailedUploads
                    ignoreUpload={ignoreUpload}
                    retryFileUpload={retryFileUpload}
                    setErrorMessage={setErrorMessage}
                    failedUploads={props.failedUploads}
                />}
                <h3 className="mb-2">
                    What category does your service fall under?
                </h3>
                <div className="search-bar mb-4">
                    <select className={`w-full cursor-pointer rounded-[8px] bg-main-white focus:outline-none 
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
            </div>
            <div className="flex justify-end gap-3">
                <button className="side-btn w-[110px]" onClick={() => dispatch({ 
                    payload: { section: CreatePostSections.BasicPackage }
                })}>
                    Back
                </button>
                {props.createdPost ?
                <div className="flex gap-3">
                    <Button 
                        action={deletePost}
                        defaultText="Delete post"
                        loadingText="Deleting post"
                        styles="red-btn btn-primary"
                        textStyles="text-error-text"
                        setErrorMessage={setErrorMessage}
                        loadingSvgSize={24}
                        loadingSvgColour="#F43C3C"
                        keepErrorMessage={true}
                    />
                    <button className="w-[110px] main-btn !h-[42px]" onClick={() => props.updatePostServicePopUp(false)}>
                        Finish
                    </button>
                </div> :
                <Button
                    action={props.createPost}
                    completedText="Post created"
                    defaultText="Post service"
                    loadingText="Creating post"
                    styles={`min-w-[185px] w-fit !h-[42px] ${!validInputs() ? "invalid-button" : "main-btn"}`}
                    textStyles="text-main-white"
                    setErrorMessage={setErrorMessage}
                    loadingSvgSize={24}
                    keepErrorMessage={true}
                />}
            </div>
        </PopUpWrapper>
    );
}

export default PostDetails;
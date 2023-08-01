import { useLocation } from "react-router-dom";
import { useEffect, useState, useContext, useReducer, useRef } from 'react';
import { PostPage } from "../../types/PostPage";
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import { getTimePosted } from "../../utils/getTimePosted";
import AboutSeller from "./AboutSeller";
import Packages from "./Packages";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import PageWrapper from "../../wrappers/PageWrapper";
import Carousel from "../../components/Carousel";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../providers/UserContext";
import TextEditor from "../../components/TextEditor";
import { aboutLimit, titleLimit } from "../CreatePost/PostDetails";
import PostImage from "./PostImage";
import ErrorPopUp from "../../components/ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import { checkImageType } from "../../utils/checkImageType";
import { MAX_FILE_BYTES } from "../CreatePost/UploadPostFiles";
import { parseFileBase64 } from "../../utils/parseFileBase64";
import { MAX_FILE_UPLOADS } from "../CreatePost/UploadPostFiles";
import LoadingSvg from "../../components/LoadingSvg";
import Reviews from "../../components/Reviews";
import CreateReview from "../../components/CreateReview";
import { scrollIntoView } from "../../utils/scrollIntoView";
import StarSvg from "../../components/StarSvg";

export type PostViewState = {
    about: string,
    title: string,
    aboutToggle: boolean,
    titleToggle: boolean,
    postData: PostPage | undefined,
    index: number,
    addingImage: boolean,
    removingImage: number
}

const initialState = {
    about: "",
    title: "",
    aboutToggle: false,
    titleToggle: false,
    postData: undefined,
    index: 0,
    addingImage: false,
    removingImage: -1
}

function PostView() {
    const location = useLocation();
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    const addImageFileRef = useRef<HTMLInputElement>(null);
    const reviewsRef = useRef<HTMLDivElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [state, dispatch] = useReducer((cur: PostViewState, payload: Partial<PostViewState>) => {
        return { ...cur, ...payload };
    }, initialState);

    const isOwner = state.postData?.postedBy.user.username === userContext.userData.username;

    function navigateToProfile(): void {
        if (state.postData) {
            navigate(`/sellers/${state.postData.sellerID}`);
        }
    }

    async function updatePost(data: Partial<{ title: string, about: string }>) {
        try {
            const resp = await axios.put<{ post: PostPage, message: string }>(`/api${location.pathname}`, data);
            dispatch({ postData: resp.data.post });
            setErrorMessage("");
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    async function getImage(ref: React.RefObject<HTMLInputElement>): Promise<unknown | undefined> {
        try {
            if (!ref.current || !ref.current.files) {
                return;
            }

            const newImage = ref.current.files[0];
            const valid = checkImageType(newImage, MAX_FILE_BYTES);

            if (valid) {
                try {
                    const base64Str = await parseFileBase64(newImage);
                    return base64Str;
                }
                catch (_: any) {
                    setErrorMessage("Something went wrong. Please try again later.");
                }
            } else {
                setErrorMessage(`Image format is unsupported or image size is over ${MAX_FILE_BYTES / 1000000}MB.`);
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    async function addImage(): Promise<void> {
        try {
            dispatch({ addingImage: true });
            const image = await getImage(addImageFileRef);
            if (image === undefined || !state.postData) {
                return;
            }

            const resp = await axios.post<{ updatedPost: PostPage, message: string }>(`/api${location.pathname}`, {
                image: image,
            });

            dispatch({
                postData: resp.data.updatedPost,
                index: state.postData.images.length
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            dispatch({ addingImage: false });
        }
    }

    function triggerFileUpload(): void {
        if (addImageFileRef.current) {
            addImageFileRef.current.click();
        }
    }

    function copyServiceID() {
        if (state.postData) {
            navigator.clipboard.writeText(state.postData.postID);
        }
    }

    async function updateTitle() {
        if (state.titleToggle && state.title.length > 0) {
            await updatePost({ title: state.title });
            dispatch({ title: state.title, titleToggle: false });
        } else {
            dispatch({ titleToggle: true });
        }
    }

    async function updateAbout() {
        if (state.aboutToggle) {
            await updatePost({ about: state.about });
            dispatch({ about: state.about, aboutToggle: false });
        } else {
            dispatch({ aboutToggle: true });
        }
    }
    
    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const resp = await axios.get<{ post: PostPage, message: string }>(`/api${location.pathname}`);
                dispatch({
                    postData: resp.data.post,
                    about: resp.data.post.about,
                    title: resp.data.post.title
                });
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                setErrorMessage(errorMessage);
            }
        })();
    }, [location.pathname]);

    if (!state.postData) {
        return (
            <p>loading</p>
        );
    }

    return (
        <div className="overflow-y-scroll h-[calc(100vh-90px)]">
            <PageWrapper styles="p-[38px] pt-[58px]" locationStack={[
                state.postData.workType.jobCategory.name,
                state.postData.workType.name,
                state.postData.title
            ]}>
                <AnimatePresence>
                    {errorMessage !== "" && 
                    <ErrorPopUp 
                        errorMessage={errorMessage} 
                        setErrorMessage={setErrorMessage} 
                    />}
                </AnimatePresence>
                <div className="flex gap-16">
                    <div className="flex-grow">
                        <div className="flex gap-3 items-center mb-3">
                            {isOwner &&
                            <p className="change" onClick={updateTitle}>
                                {state.titleToggle ? "Confirm changes" : "Change"}
                            </p>}
                            {isOwner && state.titleToggle &&
                            <p className="cancel-change" onClick={() => { dispatch({ titleToggle: false })}}>
                                Cancel changes
                            </p>}
                        </div>
                        {state.titleToggle ? 
                        <input
                            type="text" 
                            className="w-full text-[1.3rem] search-bar mt-2 mb-6 focus:outline-none"
                            value={state.title}
                            maxLength={titleLimit}
                            onChange={(e) => dispatch({ title: e.target.value })}
                        /> :
                        <h1 className="text-[1.7rem] mb-3">
                            {state.postData.title}
                        </h1>}
                        <div className="flex gap-3 items-center mb-5">
                            <div className="relative">
                                <ProfilePicAndStatus 
                                    profilePicURL={state.postData.postedBy.user.profilePicURL} 
                                    profileStatus={state.postData.postedBy.user.status}
                                    statusStyles="before:left-[33px] before:top-[34px] cursor-pointer"
                                    action={navigateToProfile}
                                    username={state.postData.postedBy.user.username}
                                    size={50}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-[10px]">
                                    <p className="link !p-0" onClick={navigateToProfile}>
                                        {state.postData.postedBy.user.username}
                                    </p>
                                    <div className="flex items-center gap-[5px]">
                                        <StarSvg size={15} backgroundColour="#292929" />
                                        <p className="text-[15px] mt-[1px]">
                                            {state.postData.postedBy.rating}
                                        </p>
                                    </div>
                                    <p className="text-[15px] text-side-text-gray mt-[1px]">
                                        ({0} reviews)
                                    </p>
                                </div>
                                <p className="text-side-text-gray text-[15px] mt-[1px]">
                                    {getTimePosted(state.postData.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <p>
                                Service ID:
                                <span className="text-main-blue">
                                    {` ${state.postData.postID}`}
                                </span>
                            </p>
                            <button className="side-btn w-fit !h-[30px] text-[15px] rounded-[6px]" onClick={copyServiceID}>
                                copy
                            </button>
                        </div>
                        <Carousel
                            images={state.postData.images}
                            btnSize={50}
                            wrapperStyles="bg-very-light-gray rounded-[12px] border 
                            border-light-border-gray shadow-info-component h-[510px]"
                            imageStyles="object-contain object-center"
                            startIndex={state.index}
                        />
                        <div className="mt-5 whitespace-nowrap overflow-x-scroll relative pb-5">
                            {state.postData.images.map((_, index: number) => {
                                return (
                                    <PostImage
                                        images={state.postData!.images}
                                        index={index}
                                        isOwner={isOwner}
                                        removingImage={state.removingImage}
                                        dispatch={dispatch}
                                        action={() => dispatch({ index: index })}
                                        getImage={getImage}
                                        key={index}
                                    />
                                )
                            })}
                            {isOwner && state.postData.images.length < MAX_FILE_UPLOADS &&
                            <>
                                <input type='file' ref={addImageFileRef} className="hidden" onChange={addImage} />
                                <div className={`inline-block absolute w-[140px] ${state.postData.images.length > 0 ? "ml-3" : ""}
                                ${state.addingImage ? "pointer-events-none" : ""}`}
                                onClick={triggerFileUpload}>
                                    <button className="change relative w-full h-[85px] flex items-center 
                                    justify-center rounded-[8px] gap-2">
                                        {state.addingImage && <LoadingSvg size={24} colour="#4E73F8" />}
                                        <span className="text-main-blue">{state.addingImage ? "Uploading" : "+ Add image"}</span>
                                    </button>
                                </div>
                            </>}
                        </div>
                        <section className="mt-8 mb-10 w-full">
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-[1.3rem]">About this service</h2>
                                {isOwner &&
                                <p className="change" onClick={updateAbout}>
                                    {state.aboutToggle ? "Confirm changes" : "Change"}
                                </p>}
                                {isOwner && state.aboutToggle &&
                                <p className="cancel-change" onClick={() => dispatch({ aboutToggle: false })}>
                                    Cancel changes
                                </p>}
                            </div>
                            {state.aboutToggle ? 
                            <TextEditor
                                value={state.about}
                                setValue={(value: string) => dispatch({ about: value })}
                                limit={aboutLimit}
                            /> : 
                            <>
                                {parse(state.postData.about)}
                            </>}
                        </section>
                        <AboutSeller 
                            description={state.postData.postedBy.description}
                            profilePicURL={state.postData.postedBy.user.profilePicURL}
                            status={state.postData.postedBy.user.status}
                            username={state.postData.postedBy.user.username}
                            sellerLevel={state.postData.postedBy.sellerLevel.name}
                            summary={state.postData.postedBy.summary}
                            country={state.postData.postedBy.user.country}
                            memberDate={state.postData.postedBy.user.memberDate}
                            rating={state.postData.postedBy.rating}
                            languages={state.postData.postedBy.languages}
                            skills={state.postData.postedBy.skills}
                            sellerID={state.postData.sellerID}
                        />
                        <Reviews 
                            url={`/api/sellers/${state.postData.sellerID}/reviews?post=${state.postData.postID}`} 
                            reviewsRef={reviewsRef}
                        />
                    </div>
                    <div className="relative min-w-[390px]">
                        <Packages 
                            packages={state.postData.packages}
                            postID={state.postData.postID}
                            seller={{
                                username: state.postData.postedBy.user.username,
                                status: state.postData.postedBy.user.status,
                                profilePicURL: state.postData.postedBy.user.profilePicURL,
                                userID: state.postData.postedBy.user.userID
                            }}
                        />
                        <button className="btn-primary text-main-white bg-main-black hover:bg-main-black-hover 
                        w-full !h-[48px] mt-[26px] shadow-info-component" 
                        onClick={() => scrollIntoView(reviewsRef)}>
                            See seller reviews
                        </button>
                        <CreateReview 
                            postID={state.postData.postID} 
                            sellerID={state.postData.sellerID}
                        />
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
}

export default PostView;
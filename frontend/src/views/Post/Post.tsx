import { useLocation } from "react-router-dom";
import { useEffect, useState, useContext, useReducer, useRef } from 'react';
import { PostPage } from "../../types/PostPage";
import ProfilePicAndStatus from "../../components/Profile/ProfilePicAndStatus";
import AboutSeller from "./AboutSeller";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import PageWrapper from "../../wrappers/PageWrapper";
import Carousel from "../../components/ui/Carousel";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../providers/UserProvider";
import TextEditor from "../../components/TextEditor/TextEditor";
import { ABOUT_SERVICE_LIMIT, SERVICE_TITLE_LIMIT } from "@freefinder/shared/dist/constants";
import PostImage from "./PostImage";
import ErrorPopUp from "../../components/Error/ErrorPopUp";
import { AnimatePresence } from "framer-motion";
import LoadingSvg from "../../components/svg/LoadingSvg";
import Reviews from "../../components/Review/Reviews";
import StarSvg from "../../components/Review/StarSvg";
import ServiceID from "../../components/common/ServiceID";
import { MAX_SERVICE_IMAGE_UPLOADS } from "@freefinder/shared/dist/constants";
import { compressImage } from "../../utils/compressImage";
import { IPostImage } from "../../models/IPostImage";
import { useTimeCreated } from "../../hooks/useTimeCreated";
import { useWindowSize } from "../../hooks/useWindowSize";
import ReviewsAndPackages from "./ReviewsAndPackages";
import InfoPopUp from "../../components/common/InfoPopUp";

export type ExtendedPostPage = PostPage & {
    postedBy: PostPage["postedBy"] & {
        _count: {
            orders: number
        }
    }
}

export type PostState = {
    about: string,
    title: string,
    aboutToggle: boolean,
    titleToggle: boolean,
    postData: ExtendedPostPage | undefined,
    index: number,
    addingImage: boolean
}

const INITIAL_STATE: PostState = {
    about: "",
    title: "",
    aboutToggle: false,
    titleToggle: false,
    postData: undefined,
    index: 0,
    addingImage: false
}

function Post() {
    const addImageFileRef = useRef<HTMLInputElement>(null);
    const reviewsRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLDivElement>(null);

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [infoMessage, setInfoMessage] = useState<string>("");

    const location = useLocation();
    const navigate = useNavigate();
    const windowSize = useWindowSize();
    const userContext = useContext(UserContext);

    const [state, dispatch] = useReducer((cur: PostState, payload: Partial<PostState>) => {
        return { ...cur, ...payload };
    }, INITIAL_STATE);

    const isOwner = state.postData?.postedBy.user.username === userContext.userData.username;
    const timeCreated = useTimeCreated(state.postData?.createdAt);

    function navigateToProfile(): void {
        if (state.postData) {
            navigate(`/sellers/${state.postData.sellerID}`);
        }
    }

    async function updatePost(data: Partial<{ title: string, about: string }>) {
        try {
            const resp = await axios.put<{ post: ExtendedPostPage, message: string }>(`/api${location.pathname}`, { update: data });
            dispatch({ postData: resp.data.post });
            setErrorMessage("");
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    async function addImage(): Promise<void> {
        try {
            if (!imagesRef.current || !addImageFileRef.current || 
                !addImageFileRef.current.files || !state.postData) {
                return;
            }

            dispatch({ addingImage: true });
            const compressedImage = await compressImage(addImageFileRef.current.files[0]);

            const formData = new FormData();
            formData.append("file", compressedImage);

            const resp = await axios.post<{ updatedPost: ExtendedPostPage, message: string }>
            (`/api${location.pathname}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
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
                const resp = await axios.get<{ post: ExtendedPostPage, message: string }>(`/api${location.pathname}`);
                dispatch({
                    postData: resp.data.post,
                    about: resp.data.post.about,
                    title: resp.data.post.title
                });
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                navigate("/error", { state: { title: "Failed to retrieve this service...", errorMessage: errorMessage } });
            }
        })();
    }, [location.pathname, navigate]);

    useEffect(() => {
        if (!state.addingImage && imagesRef.current) {
            imagesRef.current.scrollLeft = imagesRef.current.scrollWidth; 
        }
    }, [state.addingImage]);

    if (state.postData == null) {
        return (
            <></>
        );
    }

    return (
        <div className="overflow-y-scroll h-[calc(100vh-90px)]">
            <PageWrapper styles={windowSize >= 560 ? "p-[38px]" : ""} locationStack={[
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
                    {infoMessage !== "" &&
                    <InfoPopUp
                        message={infoMessage}
                        closePopUp={() => setInfoMessage("")}
                        styles="bg-main-blue"
                    />}
                </AnimatePresence>
                <div className="flex gap-16">
                    <div className="flex-grow min-w-0">
                        {isOwner &&
                        <div className="flex gap-2 items-center mb-[10px]">
                            <p className="change" onClick={updateTitle}>
                                {state.titleToggle ? "Confirm" : "Change"}
                            </p>
                            {state.titleToggle &&
                            <p className="cancel-change" onClick={() => { dispatch({ titleToggle: false })}}>
                                Cancel
                            </p>}
                        </div>}
                        {state.titleToggle ? 
                        <input
                            type="text" 
                            className="w-full text-[1.3rem] search-bar mt-2 mb-6 focus:outline-none"
                            value={state.title}
                            maxLength={SERVICE_TITLE_LIMIT}
                            onChange={(e) => dispatch({ title: e.target.value })}
                        /> :
                        <h1 className={`${windowSize >= 500 ? "text-[27px]" : "text-[21px]"} mb-3`}>
                            {state.postData.title}
                        </h1>}
                        <div className="flex gap-3 items-center mb-3">
                            <div className="relative">
                                <ProfilePicAndStatus 
                                    profilePicURL={state.postData.postedBy.user.profilePicURL} 
                                    profileStatus={state.postData?.postedBy.user.status}
                                    action={navigateToProfile}
                                    username={state.postData.postedBy.user.username}
                                    size={windowSize >= 500 ? 50 : 45}
                                    statusRight={true}
                                />
                            </div>
                            <div className="flex-grow overflow-hidden">
                                <div className="flex gap-[10px] items-center">
                                    <p className="link !p-0 text-ellipsis whitespace-nowrap overflow-hidden" 
                                    title={state.postData.postedBy.user.username} onClick={navigateToProfile}>
                                        {state.postData.postedBy.user.username}
                                    </p>
                                    <div className="flex items-center gap-[5px] flex-shrink-0">
                                        <StarSvg 
                                            size={15} 
                                            backgroundColour="#18193F" 
                                        />
                                        <p className="text-[15px] mt-[1px]">
                                            {state.postData.postedBy.rating}
                                        </p>
                                    </div>
                                </div>
                                <p className={`text-side-text-gray text-[15px] ${windowSize >= 430 ? "mt-[1px]" : ""}`}>
                                    {`Posted ${timeCreated}`}
                                </p>
                            </div>
                        </div>
                        <ServiceID
                            data={state.postData.postID}
                            setInfoMessage={setInfoMessage}
                            postID={state.postData.postID}
                            textSize={15}
                            hideText={windowSize < 510}
                            styles="mb-4"
                        />
                        <div className="w-full relative overflow-hidden bg-very-light-gray rounded-[12px] border 
                        border-light-border-gray shadow-info-component">
                            <Carousel
                                images={state.postData.images}
                                btnSize={windowSize >= 620 ? 50 : windowSize >= 420 ? 40 : 35}
                                wrapperStyles="pb-[56.25%]"
                                imageStyles="object-contain object-center"
                                startIndex={state.index}
                            />
                            {state.postData.hidden && 
                            <p className="absolute top-0 text-center bg-side-text-gray text-main-white w-full py-[10px]">
                                This service has been hidden by the seller.
                            </p>}
                        </div>
                        <div className="mt-6 whitespace-nowrap overflow-x-scroll relative pb-3 mb-7" ref={imagesRef}>
                            {state.postData.images.map((image: IPostImage, index: number) => {
                                return (
                                    <PostImage
                                        images={state.postData!.images}
                                        index={index}
                                        isOwner={isOwner}
                                        dispatch={dispatch}
                                        action={() => dispatch({ index: index })}
                                        key={image.url}
                                    />
                                )
                            })}
                            {isOwner && state.postData.images.length < MAX_SERVICE_IMAGE_UPLOADS &&
                            <>
                                <input type='file' ref={addImageFileRef} className="hidden" onChange={addImage} />
                                <div className={`inline-block absolute w-[140px] ${state.postData.images.length > 0 ? "ml-3" : ""}
                                ${state.addingImage ? "pointer-events-none" : ""}`}
                                onClick={triggerFileUpload}>
                                    <button className="change relative w-full h-[85px] flex items-center 
                                    justify-center rounded-[8px] gap-2">
                                        {state.addingImage && <LoadingSvg size={24} colour="#4169f7" />}
                                        <span className="text-main-blue text-[15px]">
                                            {state.addingImage ? "Uploading" : "+ Add image"}
                                        </span>
                                    </button>
                                </div>
                            </>}
                        </div>
                        {windowSize < 1130 &&
                        <ReviewsAndPackages
                            state={state}
                            reviewsRef={reviewsRef}
                            styles="w-full mb-8"
                        />}
                        <section className="mb-10 w-full">
                            <div className="flex items-center gap-2 mb-3">
                                <h2 className="text-[1.3rem] mr-1">About this service</h2>
                                {isOwner &&
                                <p className="change" onClick={updateAbout}>
                                    {state.aboutToggle ? "Confirm" : "Change"}
                                </p>}
                                {isOwner && state.aboutToggle &&
                                <p className="cancel-change" onClick={() => dispatch({ aboutToggle: false })}>
                                    Cancel
                                </p>}
                            </div>
                            {state.aboutToggle ? 
                            <TextEditor
                                value={state.about}
                                setValue={(value: string) => dispatch({ about: value })}
                                limit={ABOUT_SERVICE_LIMIT}
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
                            ordersFilled={state.postData.postedBy._count.orders}
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
                    {windowSize >= 1130 &&
                    <ReviewsAndPackages
                        state={state}
                        reviewsRef={reviewsRef}
                        styles={windowSize < 1320 ? "w-[340px]" : "w-[390px]"}
                    />}
                </div>
            </PageWrapper>
        </div>
    );
}

export default Post;
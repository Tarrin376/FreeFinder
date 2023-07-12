import { useLocation } from "react-router-dom";
import { useEffect, useState, useContext, useReducer } from 'react';
import { PostPage } from "../../types/PostPage";
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import StarIcon from '../../assets/star.png';
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

type UpdatePostToggles = "aboutToggle" | "titleToggle";

type UpdatePostArgs = {
    data: {
        about?: string,
        title?: string,
    }
    toggles: {
        aboutToggle?: boolean,
        titleToggle?: boolean,
    }
}

enum Actions {
    TOGGLE,
    UPDATE
}

type ReducerAction = {
    type: Actions,
    payload: UpdatePostArgs["data"] | UpdatePostArgs["toggles"]
}

const initialState = {
    data: {
        about: "",
        title: "",
    },
    toggles: {
        aboutToggle: false,
        titleToggle: false,
    }
}

function reducer(state: UpdatePostArgs, action: ReducerAction): UpdatePostArgs {
    switch (action.type) {
        case Actions.TOGGLE:
            return { ...state, toggles: { ...state.toggles, ...action.payload } };
        case Actions.UPDATE:
            return { ...state, data: { ...state.data, ...action.payload } };
        default:
            throw new Error("Invalid action type or payload given.");
    }
}

function PostView() {
    const location = useLocation();
    const navigate = useNavigate();
    const userContext = useContext(UserContext);

    const [postData, setPostData] = useState<PostPage>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [index, setIndex] = useState<number>(0);

    const [state, dispatch] = useReducer(reducer, initialState);
    const isOwner = postData?.postedBy.user.username === userContext.userData.username;

    function navigateToProfile(): void {
        if (postData) {
            navigate(`/sellers/${postData.postedBy.user.username}`);
        }
    }

    async function updatePost(data: UpdatePostArgs["data"]) {
        try {
            const resp = await axios.put<{ post: PostPage, message: string }>(`/api${location.pathname}`, data);
            setPostData(resp.data.post);
            setErrorMessage("");
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
    }

    function toggle(change: UpdatePostToggles) {
        const cpy = {...state.toggles};
        cpy[change] = !cpy[change];
        dispatch({ type: Actions.TOGGLE, payload: cpy });
    }

    function confirmChanges(data: UpdatePostArgs["data"], change: UpdatePostToggles) {
        if (state.toggles[change]) {
            updatePost(data);
        }

        toggle(change);
    }
    
    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const resp = await axios.get<{ post: PostPage, message: string }>(`/api${location.pathname}`);
                setPostData(resp.data.post);
                dispatch({ type: Actions.UPDATE, payload: { 
                    about: resp.data.post.about, 
                    title: resp.data.post.title 
                }});
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                setErrorMessage(errorMessage);
            }
        })();
    }, [location.pathname]);

    if (!postData) {
        return (
            <p>loading</p>
        );
    }

    return (
        <div className="overflow-y-scroll h-[calc(100vh-90px)]">
            <PageWrapper styles="p-[38px] pt-[58px]" locationStack={[
                "Browse all", 
                postData.postedBy.user.username, 
                postData.title
            ]}>
                <AnimatePresence>
                    {errorMessage !== "" && 
                    <ErrorPopUp 
                        errorMessage={errorMessage} 
                        setErrorMessage={setErrorMessage} 
                    />}
                </AnimatePresence>
                <div className="flex gap-20">
                    <div className="flex-grow overflow-hidden">
                        <div className="flex gap-3 items-center">
                            {isOwner &&
                            <p className="change mb-2" onClick={() => confirmChanges({ title: state.data.title }, "titleToggle")}>
                                {state.toggles.titleToggle ? "Confirm changes" : "Change"}
                            </p>}
                            {isOwner && state.toggles.titleToggle &&
                            <p className="cancel-change mb-2" onClick={() => toggle("titleToggle")}>
                                Cancel changes
                            </p>}
                        </div>
                        {state.toggles.titleToggle ? 
                        <input
                            type="text" 
                            className="w-full text-2xl search-bar mt-2 mb-6"
                            value={state.data.title}
                            maxLength={titleLimit}
                            onChange={(e) => dispatch({ type: Actions.UPDATE, payload: { title: e.target.value } })}
                        /> :
                        <h1 className="text-3xl mb-4">
                            {postData.title}
                        </h1>}
                        <div className="flex gap-3 items-center mb-6">
                            <div className="relative">
                                <ProfilePicAndStatus 
                                    profilePicURL={postData.postedBy.user.profilePicURL} 
                                    profileStatus={postData.postedBy.user.status}
                                    statusStyles="before:left-[33px] before:top-[34px] cursor-pointer"
                                    imgStyles="w-[50px] h-[50px]"
                                    action={navigateToProfile}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-[7px]">
                                    <p className="link hover:font-normal !p-0" onClick={navigateToProfile}>
                                        {postData.postedBy.user.username}
                                    </p>
                                    <img src={StarIcon} className="w-[18px] h-[18px]" alt="star" />
                                    <p className="text-[15px]">
                                        {postData.postedBy.rating}
                                    </p>
                                    <p className="text-[15px] text-side-text-gray">
                                        ({postData.postedBy._count.reviews} reviews)
                                    </p>
                                </div>
                                <p className="text-side-text-gray text-[15px] mt-[1px]">
                                    {getTimePosted(postData.createdAt)}
                                </p>
                            </div>
                        </div>
                        <Carousel
                            images={postData.images}
                            btnSize={50}
                            wrapperStyles="bg-very-light-gray rounded-[12px] border 
                            border-very-light-gray shadow-info-component h-[584px]"
                            imageStyles="object-contain object-center"
                            startIndex={index}
                        />
                        <div className="mt-5 whitespace-nowrap overflow-x-scroll relative pb-5">
                            {postData.images.map((_, index: number) => {
                                return (
                                    <PostImage
                                        images={postData.images}
                                        index={index}
                                        isOwner={isOwner}
                                        setPostData={setPostData}
                                        setIndex={setIndex}
                                        action={() => setIndex(index)}
                                        key={index}
                                    />
                                )
                            })}
                        </div>
                        <section className="mt-8 mb-10 w-full">
                            <div className="mb-3 flex items-center gap-3">
                                <h2 className="text-2xl">About this service</h2>
                                {isOwner &&
                                <p className="change" onClick={() => confirmChanges({ about: state.data.about }, "aboutToggle")}>
                                    {state.toggles.aboutToggle ? "Confirm changes" : "Change"}
                                </p>}
                                {isOwner && state.toggles.aboutToggle &&
                                <p className="cancel-change" onClick={() => toggle("aboutToggle")}>
                                    Cancel changes
                                </p>}
                            </div>
                            {state.toggles.aboutToggle ? 
                            <TextEditor
                                value={state.data.about}
                                setValue={(value: string) => dispatch({ type: Actions.UPDATE, payload: { about: value } })}
                                limit={aboutLimit}
                            /> : 
                            <>
                                {parse(postData.about)}
                            </>}
                        </section>
                        <AboutSeller 
                            description={postData.postedBy.description}
                            profilePicURL={postData.postedBy.user.profilePicURL}
                            status={postData.postedBy.user.status}
                            username={postData.postedBy.user.username}
                            sellerLevel={postData.postedBy.sellerLevel.name}
                            summary={postData.postedBy.summary}
                            country={postData.postedBy.user.country}
                            memberDate={postData.postedBy.user.memberDate}
                            rating={postData.postedBy.rating}
                            languages={postData.postedBy.languages}
                            skills={postData.postedBy.skills}
                            sellerID={postData.sellerID}
                        />
                    </div>
                    <div>
                        <Packages packages={postData.packages} />
                        <button className="main-btn mt-[26px] shadow-pop-up">
                            {`See Seller Reviews (${postData.postedBy._count.reviews})`}
                        </button>
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
}

export default PostView;
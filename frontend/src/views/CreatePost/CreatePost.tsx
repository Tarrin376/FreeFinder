import { useState, useRef, useContext, useReducer } from 'react';
import UploadPostFiles from "./UploadPostFiles";
import PostDetails from "./PostDetails";
import ChooseThumbnail from './ChooseThumbnail';
import Package from './Package';
import { IPackage } from '../../models/IPackage';
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { FailedUpload } from '../../types/FailedUploaded';
import { UserContext } from '../../providers/UserProvider';
import { PackageTypes } from '../../enums/PackageTypes';
import { Sections } from '../../enums/Sections';
import { FileData } from '../../types/FileData';
import { IUser } from '../../models/IUser';

interface CreatePostProps {
    updatePostServicePopUp: (val: boolean) => void,
    resetState: () => void
}

export type PostData = {
    about: string,
    title: string,
    workType: string,
    packages: IPackage[],
    thumbnail: unknown
}

export type CreatePostState = {
    basic: PackageState,
    standard: PackageState,
    superior: PackageState,
    section: Sections,
    uploadedImages: FileData[],
    thumbnail: FileData | undefined,
    failedUploads: FailedUpload[],
    createdPost: boolean,
    title: string,
    about: string,
    jobCategory: string,
    workType: string
}

export type PackageState = {
    revisions: string,
    features: string[],
    deliveryTime: number,
    amount: number,
    description: string,
    title: string
}

export type CreatePostReducerAction = { 
    type: PackageTypes,
    payload: Partial<PackageState>
} | {
    type?: undefined,
    payload: Partial<CreatePostState>
};

const INITIAL_PACKAGE_STATE: PackageState = {
    revisions: "1",
    features: [],
    deliveryTime: 0,
    amount: 0,
    description: "",
    title: "",
}

const INITIAL_STATE: CreatePostState = {
    basic: { ...INITIAL_PACKAGE_STATE },
    standard: { ...INITIAL_PACKAGE_STATE },
    superior: { ...INITIAL_PACKAGE_STATE },
    section: Sections.UploadFiles,
    uploadedImages: [],
    thumbnail: undefined,
    failedUploads: [],
    createdPost: false,
    title: "",
    about: "",
    jobCategory: "",
    workType: ""
}

function reducer(state: CreatePostState, action: CreatePostReducerAction): CreatePostState {
    switch (action.type) {
        case PackageTypes.BASIC:
            return { ...state, basic: { ...state.basic, ...action.payload } };
        case PackageTypes.STANDARD:
            return { ...state, standard: { ...state.standard, ...action.payload } };
        case PackageTypes.SUPERIOR:
            return { ...state, superior: { ...state.superior, ...action.payload } };
        default:
            return { ...state, ...action.payload };
    }
}

function CreatePost({ updatePostServicePopUp, resetState }: CreatePostProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    const postID = useRef<string>("");
    const userContext = useContext(UserContext);

    function constructPackage(pkg: PackageState, type: PackageTypes): IPackage {
        return {
            ...pkg,
            numOrders: 0,
            type: type,
            features: pkg.features.filter((x) => x.trim() !== "").map((x) => x.trim()),
        }
    }

    function constructPost(): PostData {
        const post: PostData = { 
            about: state.about.trim(), 
            title: state.title.trim(),
            workType: state.workType,
            thumbnail: state.thumbnail?.base64Str,
            packages: [constructPackage(state.basic, PackageTypes.BASIC)]
        };

        if (state.standard.deliveryTime > 0) {
            post.packages.push(constructPackage(state.standard, PackageTypes.STANDARD));
            if (state.superior.deliveryTime > 0) {
                post.packages.push(constructPackage(state.superior, PackageTypes.SUPERIOR));
            }
        }

        return post;
    }

    async function createPost(): Promise<string | undefined> {
        const post: PostData = constructPost();

        try {
            const resp = await axios.post<{ postID: string, seller: IUser["seller"], message: string }>(`/api/posts`, post);
            postID.current = resp.data.postID;
            const addedImages = await addPostImages(resp.data.postID);

            if (addedImages) {
                setErrorMessage("");
                updatePostServicePopUp(false);
                resetState();
            }

            if (!userContext.userData.seller) {
                userContext.setUserData({
                    ...userContext.userData,
                    seller: resp.data.seller
                });
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    async function addPostImages(postID: string): Promise<boolean> {
        const failed = [];

        for (let i = 0; i < state.uploadedImages.length; i++) {
            try {
                if (state.uploadedImages[i] !== state.thumbnail) {
                    await axios.post<{ secure_url: string, message: string }>(`/api/posts/${postID}`, {
                        image: state.uploadedImages[i].base64Str,
                    });
                }
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                failed.push({
                    fileData: state.uploadedImages[i], 
                    errorMessage: errorMessage
                });
            }
        }

        dispatch({
            payload: { failedUploads: failed }
        });

        if (failed.length > 0) {
            setErrorMessage(`Unable to upload ${failed.length} ${failed.length === 1 ? "image" : "images"}.`);
            return false;
        }

        return true;
    }

    switch (state.section) {
        case Sections.UploadFiles:
            return (
                <UploadPostFiles 
                    dispatch={dispatch}
                    updatePostServicePopUp={updatePostServicePopUp} 
                    uploadedImages={state.uploadedImages} 
                    thumbnail={state.thumbnail}
                />
            );
        case Sections.ChooseThumbnail:
            return (
                <ChooseThumbnail 
                    dispatch={dispatch}
                    updatePostServicePopUp={updatePostServicePopUp}
                    uploadedImages={state.uploadedImages}
                    thumbnail={state.thumbnail}
                />
            );
        case Sections.BasicPackage:
            return (
                <Package 
                    dispatch={dispatch}
                    updatePostServicePopUp={updatePostServicePopUp} 
                    back={Sections.ChooseThumbnail} 
                    next={Sections.StandardPackage} 
                    title="Basic package"
                    pkgState={state.basic}
                    state={state}
                    packageType={PackageTypes.BASIC}
                />
            );
        case Sections.StandardPackage:
            return (
                <Package 
                    dispatch={dispatch}
                    updatePostServicePopUp={updatePostServicePopUp} 
                    back={Sections.BasicPackage} 
                    skip={Sections.PostDetails} 
                    next={Sections.SuperiorPackage} 
                    title="Standard package"
                    pkgState={state.standard}
                    state={state}
                    packageType={PackageTypes.STANDARD}
                />
            );
        case Sections.SuperiorPackage:
            return (
                <Package 
                    dispatch={dispatch}
                    updatePostServicePopUp={updatePostServicePopUp}
                    back={Sections.StandardPackage} 
                    skip={Sections.PostDetails} 
                    next={Sections.PostDetails} 
                    title="Superior package"
                    pkgState={state.superior}
                    state={state}
                    packageType={PackageTypes.SUPERIOR}
                />
            );
        default:
            return (
                <PostDetails 
                    dispatch={dispatch}
                    updatePostServicePopUp={updatePostServicePopUp} 
                    about={state.about} 
                    title={state.title} 
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    createPost={createPost}
                    failedUploads={state.failedUploads}
                    postID={postID.current}
                    createdPost={state.createdPost}
                    jobCategory={state.jobCategory}
                    workType={state.workType}
                />
            );
    }
}

export default CreatePost;
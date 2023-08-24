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
import { CreatePostSections } from '../../enums/CreatePostSections';
import { IUser } from '../../models/IUser';
import { compressImage } from 'src/utils/compressImage';

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
    section: CreatePostSections,
    uploadedImages: File[],
    thumbnail: File | undefined,
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
    section: CreatePostSections.UploadFiles,
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

    async function constructPost(): Promise<Omit<PostData, "thumbnail">> {
        const post: Omit<PostData, "thumbnail"> = { 
            about: state.about.trim(), 
            title: state.title.trim(),
            workType: state.workType,
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
        const post = await constructPost();
        const compressedImage = await compressImage(state.thumbnail!);

        const formData = new FormData();
        formData.append("file", compressedImage);
        formData.append("post", JSON.stringify(post));

        try {
            const resp = await axios.post<{ postID: string, seller: IUser["seller"], message: string }>(`/api/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            postID.current = resp.data.postID;
            const failed = await addPostImages(resp.data.postID);
            
            if (failed.length === 0) {
                setErrorMessage("");
                updatePostServicePopUp(false);
                resetState();
            } else {
                return `Unable to upload ${failed.length} ${failed.length === 1 ? "image" : "images"}.`;
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

    async function addPostImages(postID: string): Promise<FailedUpload[]> {
        const failed: FailedUpload[] = [];

        for (let i = 0; i < state.uploadedImages.length; i++) {
            try {
                if (state.uploadedImages[i] !== state.thumbnail) {
                    const compressed = await compressImage(state.uploadedImages[i]);
                    const formData = new FormData();
                    formData.append("file", compressed);
                    formData.append("sizes", JSON.stringify({
                        oldSize: state.uploadedImages[i].size,
                        newSize: compressed.size
                    }));

                    await axios.post<{ message: string }>(`/api/posts/${postID}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                failed.push({
                    file: state.uploadedImages[i], 
                    errorMessage: errorMessage
                });
            }
        }

        dispatch({
            payload: { 
                failedUploads: failed, 
                createdPost: true
            }
        });

        return failed;
    }

    switch (state.section) {
        case CreatePostSections.UploadFiles:
            return (
                <UploadPostFiles 
                    dispatch={dispatch}
                    updatePostServicePopUp={updatePostServicePopUp} 
                    uploadedImages={state.uploadedImages} 
                    thumbnail={state.thumbnail}
                />
            );
        case CreatePostSections.ChooseThumbnail:
            return (
                <ChooseThumbnail 
                    dispatch={dispatch}
                    updatePostServicePopUp={updatePostServicePopUp}
                    uploadedImages={state.uploadedImages}
                    thumbnail={state.thumbnail}
                />
            );
        case CreatePostSections.BasicPackage:
            return (
                <Package 
                    dispatch={dispatch}
                    updatePostServicePopUp={updatePostServicePopUp} 
                    back={CreatePostSections.ChooseThumbnail} 
                    next={CreatePostSections.StandardPackage} 
                    title="Basic package"
                    pkgState={state.basic}
                    state={state}
                    packageType={PackageTypes.BASIC}
                />
            );
        case CreatePostSections.StandardPackage:
            return (
                <Package 
                    dispatch={dispatch}
                    updatePostServicePopUp={updatePostServicePopUp} 
                    back={CreatePostSections.BasicPackage} 
                    skip={CreatePostSections.PostDetails} 
                    next={CreatePostSections.SuperiorPackage} 
                    title="Standard package"
                    pkgState={state.standard}
                    state={state}
                    packageType={PackageTypes.STANDARD}
                />
            );
        case CreatePostSections.SuperiorPackage:
            return (
                <Package 
                    dispatch={dispatch}
                    updatePostServicePopUp={updatePostServicePopUp}
                    back={CreatePostSections.StandardPackage} 
                    skip={CreatePostSections.PostDetails} 
                    next={CreatePostSections.PostDetails} 
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
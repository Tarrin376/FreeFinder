import { useState, useRef, useContext, useReducer } from 'react';
import UploadPostFiles from "./UploadPostFiles";
import PostDetails from "./PostDetails";
import ChooseThumbnail from './ChooseThumbnail';
import Package from './Package';
import { IPackage } from '../../models/IPackage';
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { FailedUpload } from '../../types/FailedUploaded';
import { ImageData } from '../../types/ImageData';
import { ISeller } from '../../models/ISeller';
import { UserContext } from '../../providers/UserContext';
import { PackageTypes } from '../../enums/PackageTypes';
import { Sections } from '../../enums/Sections';

interface CreatePostProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    resetState: () => void
}

export type PostData = {
    about: string,
    title: string,
    packages: IPackage[],
    thumbnail: unknown
}

export type InitialState = {
    basic: InitialPackageState,
    standard: InitialPackageState,
    superior: InitialPackageState
}

export type InitialPackageState = {
    revisions: string,
    features: string[],
    deliveryTime: number,
    amount: number,
    description: string,
    title: string
}

export type ReducerAction = { 
    type: PackageTypes,
    payload: { 
        revisions?: string,
        features?: string[],
        deliveryTime?: number,
        amount?: number,
        description?: string,
        title?: string
    }
};

const initialPkgState: InitialPackageState = {
    revisions: "1",
    features: [],
    deliveryTime: 0,
    amount: 0,
    description: "",
    title: "",
}

const initialState: InitialState = {
    basic: {
        ...initialPkgState
    },
    standard: {
        ...initialPkgState
    },
    superior: {
        ...initialPkgState
    }
}

function reducer(state: InitialState, action: ReducerAction): InitialState {
    switch (action.type) {
        case PackageTypes.BASIC:
            return { ...state, basic: { ...state.basic, ...action.payload } };
        case PackageTypes.STANDARD:
            return { ...state, standard: { ...state.standard, ...action.payload } };
        case PackageTypes.SUPERIOR:
            return { ...state, superior: { ...state.superior, ...action.payload } };
        default:
            throw new Error("Invalid action type given.");
    }
}

function CreatePost({ setPostService, resetState }: CreatePostProps) {
    const [section, setSection] = useState<Sections>(Sections.UploadFiles);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [uploadedImages, setUploadedImages] = useState<ImageData[]>([]);
    const [thumbnail, setThumbnail] = useState<ImageData | undefined>();
    const [failedUploads, setFailedUploads] = useState<FailedUpload[]>([]);
    const [createdPost, setCreatedPost] = useState<boolean>(false);
    const postID = useRef<string>("");
    const userContext = useContext(UserContext);
    const [title, setTitle] = useState<string>("");
    const [about, setAbout] = useState<string>("");
    
    const [state, dispatch] = useReducer(reducer, initialState);

    function constructPackage(pkg: InitialPackageState, type: ReducerAction["type"]): IPackage {
        return {
            ...pkg,
            numOrders: 0,
            type: type,
            features: pkg.features.filter((x) => x.trim() !== "").map((x) => x.trim()),
        }
    }

    function constructPost(): PostData {
        const post: PostData = { 
            about: about.trim(), 
            title: title.trim(),
            thumbnail: thumbnail?.image,
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
        const minPrice = post.packages.reduce((acc, cur) => Math.min(cur.amount, acc), Infinity);

        try {
            const resp = await axios.post<{ postID: string, seller: ISeller, message: string }>(`/api/posts`, {
                startingPrice: minPrice,
                post: post
            });

            postID.current = resp.data.postID;
            const addedImages = await addPostImages(resp.data.postID);

            if (addedImages) {
                setErrorMessage("");
                setPostService(false);
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

        for (let i = 0; i < uploadedImages.length; i++) {
            try {
                if (uploadedImages[i] !== thumbnail) {
                    await axios.post(`/api/posts/${postID}`, {
                        image: uploadedImages[i].image,
                    });
                }
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                failed.push({
                    imageData: uploadedImages[i], 
                    errorMessage: errorMessage
                });
            }
        }

        setFailedUploads(failed);
        if (failed.length > 0) {
            setErrorMessage(`Unable to upload ${failed.length} ${failed.length === 1 ? "image" : "images"}.`);
            return false;
        }

        return true;
    }

    switch (section) {
        case Sections.UploadFiles:
            return (
                <UploadPostFiles 
                    setPostService={setPostService} 
                    setSection={setSection}
                    uploadedImages={uploadedImages} 
                    setUploadedImages={setUploadedImages}
                    thumbnail={thumbnail}
                    setThumbnail={setThumbnail}
                />
            );
        case Sections.ChooseThumbnail:
            return (
                <ChooseThumbnail 
                    setSection={setSection} 
                    setPostService={setPostService}
                    uploadedImages={uploadedImages}
                    thumbnail={thumbnail}
                    setThumbnail={setThumbnail}
                />
            );
        case Sections.BasicPackage:
            return (
                <Package 
                    setSection={setSection} 
                    setPostService={setPostService} 
                    back={Sections.ChooseThumbnail} 
                    next={Sections.StandardPackage} 
                    title="Basic package"
                    pkgState={state.basic}
                    state={state}
                    dispatch={dispatch}
                    packageType={PackageTypes.BASIC}
                />
            );
        case Sections.StandardPackage:
            return (
                <Package 
                    setSection={setSection} 
                    setPostService={setPostService} 
                    back={Sections.BasicPackage} 
                    skip={Sections.PostDetails} 
                    next={Sections.SuperiorPackage} 
                    title="Standard package"
                    pkgState={state.standard}
                    state={state}
                    dispatch={dispatch}
                    packageType={PackageTypes.STANDARD}
                />
            );
        case Sections.SuperiorPackage:
            return (
                <Package 
                    setSection={setSection} 
                    setPostService={setPostService}
                    back={Sections.StandardPackage} 
                    skip={Sections.PostDetails} 
                    next={Sections.PostDetails} 
                    title="Superior package"
                    pkgState={state.superior}
                    state={state}
                    dispatch={dispatch}
                    packageType={PackageTypes.SUPERIOR}
                />
            );
        default:
            return (
                <PostDetails 
                    setPostService={setPostService} 
                    setSection={setSection}
                    setAbout={setAbout} 
                    setTitle={setTitle}
                    about={about} 
                    title={title} 
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    createPost={createPost}
                    failedUploads={failedUploads}
                    setFailedUploads={setFailedUploads}
                    postID={postID.current}
                    createdPost={createdPost}
                    setCreatedPost={setCreatedPost}
                />
            );
    }
}

export default CreatePost;
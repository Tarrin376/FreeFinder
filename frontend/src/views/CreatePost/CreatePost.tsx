import { useState, useRef, useContext } from 'react';
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

export enum Sections {
    PostDetails,
    UploadFiles,
    ChooseThumbnail,
    BasicPackage,
    StandardPackage,
    SuperiorPackage
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

    // PostDetails states
    const [title, setTitle] = useState<string>("");
    const [about, setAbout] = useState<string>("");

    // BasicPackage states
    const [basicRevisions, setBasicRevisions] = useState<string>("1");
    const [basicFeatures, setBasicFeatures] = useState<string[]>([]);
    const [basicDeliveryTime, setBasicDeliveryTime] = useState<number>(0);
    const [basicAmount, setBasicAmount] = useState<number>(0);
    const [basicDescription, setBasicDescription] = useState<string>("");
    const [basicPackageTitle, setBasicPackageTitle] = useState<string>("");

    // StandardPackage states
    const [standardRevisions, setStandardRevisions] = useState<string>("1");
    const [standardFeatures, setStandardFeatures] = useState<string[]>([]);
    const [standardDeliveryTime, setStandardDeliveryTime] = useState<number>(0);
    const [standardAmount, setStandardAmount] = useState<number>(0);
    const [standardDescription, setStandardDescription] = useState<string>("");
    const [standardPackageTitle, setStandardPackageTitle] = useState<string>("");

    // SuperiorPackage states
    const [superiorRevisions, setSuperiorRevisions] = useState<string>("1");
    const [superiorFeatures, setSuperiorFeatures] = useState<string[]>([]);
    const [superiorDeliveryTime, setSuperiorDeliveryTime] = useState<number>(0);
    const [superiorAmount, setSuperiorAmount] = useState<number>(0);
    const [superiorDescription, setSuperiorDescription] = useState<string>("");
    const [superiorPackageTitle, setSuperiorPackageTitle] = useState<string>("");

    function constructPost(): PostData {
        const post: PostData = { 
            about: about.trim(), 
            title: title.trim(),
            thumbnail: thumbnail?.image,
            packages: [
                {
                    revisions: basicRevisions,
                    features: basicFeatures.filter((x) => x.trim() !== "").map((x) => x.trim()),
                    deliveryTime: basicDeliveryTime,
                    description: basicDescription,
                    amount: basicAmount,
                    numOrders: 0,
                    type: "BASIC",
                    packageTitle: basicPackageTitle
                }
            ]
        };

        if (standardDeliveryTime > 0) {
            post.packages.push({
                revisions: standardRevisions,
                features: standardFeatures.filter((x) => x.trim() !== "").map((x) => x.trim()),
                deliveryTime: standardDeliveryTime,
                description: standardDescription,
                amount: standardAmount,
                numOrders: 0,
                type: "STANDARD",
                packageTitle: standardPackageTitle
            });
        } else {
            return post;
        }

        if (superiorDeliveryTime > 0) {
            post.packages.push({
                revisions: superiorRevisions,
                features: superiorFeatures.filter((x) => x.trim() !== "").map((x) => x.trim()),
                deliveryTime: superiorDeliveryTime,
                description: superiorDescription,
                amount: superiorAmount,
                numOrders: 0,
                type: "SUPERIOR",
                packageTitle: superiorPackageTitle
            });
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
                    setRevisions={setBasicRevisions} 
                    setFeatures={setBasicFeatures}
                    setDeliveryTime={setBasicDeliveryTime} 
                    setDescription={setBasicDescription} 
                    setPostService={setPostService} 
                    setAmount={setBasicAmount} 
                    setPackageTitle={setBasicPackageTitle}
                    features={basicFeatures} 
                    back={Sections.ChooseThumbnail} 
                    next={Sections.StandardPackage} 
                    deliveryTime={basicDeliveryTime} 
                    title="Basic package"
                    revisions={basicRevisions} 
                    description={basicDescription}
                    amount={basicAmount}
                    packageTitle={basicPackageTitle}
                />
            );
        case Sections.StandardPackage:
            return (
                <Package 
                    setSection={setSection} 
                    setRevisions={setStandardRevisions} 
                    setFeatures={setStandardFeatures}
                    setDeliveryTime={setStandardDeliveryTime} 
                    setDescription={setStandardDescription} 
                    setPostService={setPostService} 
                    setAmount={setStandardAmount} 
                    setPackageTitle={setStandardPackageTitle}
                    features={standardFeatures} 
                    back={Sections.BasicPackage} 
                    skip={Sections.PostDetails} 
                    next={Sections.SuperiorPackage} 
                    deliveryTime={standardDeliveryTime} 
                    revisions={standardRevisions} 
                    description={standardDescription} 
                    title="Standard package"
                    amount={standardAmount}
                    packageTitle={standardPackageTitle}
                />
            );
        case Sections.SuperiorPackage:
            return (
                <Package 
                    setSection={setSection} 
                    setRevisions={setSuperiorRevisions} 
                    setFeatures={setSuperiorFeatures}
                    setDeliveryTime={setSuperiorDeliveryTime} 
                    setDescription={setSuperiorDescription} 
                    setPostService={setPostService}
                    setAmount={setSuperiorAmount} 
                    setPackageTitle={setSuperiorPackageTitle}
                    features={superiorFeatures} 
                    back={Sections.StandardPackage} 
                    skip={Sections.PostDetails} 
                    next={Sections.PostDetails} 
                    deliveryTime={superiorDeliveryTime} 
                    revisions={superiorRevisions} 
                    description={superiorDescription} 
                    title="Superior package"
                    amount={superiorAmount}
                    packageTitle={superiorPackageTitle}
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
import { useState } from 'react';
import { IPost } from "../../models/IPost";
import UploadPostFiles from "./UploadPostFiles";
import PostDetails from "./PostDetails";
import ChooseThumbnail from './ChooseThumbnail';
import Package from './Package';
import { IPackage } from '../../models/IPackage';
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { parseImage } from '../../utils/parseImage';
import { FailedUpload } from '../../types/FailedUploaded';

interface CreatePostProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setUserPosts: React.Dispatch<React.SetStateAction<IPost[]>>,
    setReachedBottom: React.Dispatch<React.SetStateAction<boolean>>,
    setNextPage: React.Dispatch<React.SetStateAction<boolean>>,
    cursor:  React.MutableRefObject<string>
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

function CreatePost({ setPostService, setUserPosts, cursor, setReachedBottom, setNextPage }: CreatePostProps) {
    const [section, setSection] = useState<Sections>(Sections.UploadFiles);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [thumbnail, setThumbnail] = useState<unknown>();
    const [failedUploads, setFailedUploads] = useState<FailedUpload[]>([]);

    // PostDetails states
    const [title, setTitle] = useState<string>("");
    const [about, setAbout] = useState<string>("");

    // BasicPackage states
    const [basicRevisions, setBasicRevisions] = useState<string>("1");
    const [basicFeatures, setBasicFeatures] = useState<string[]>([]);
    const [basicDeliveryTime, setBasicDeliveryTime] = useState<number>(0);
    const [basicAmount, setBasicAmount] = useState<number>(0);
    const [basicDescription, setBasicDescription] = useState<string>("");

    // StandardPackage states
    const [standardRevisions, setStandardRevisions] = useState<string>("1");
    const [standardFeatures, setStandardFeatures] = useState<string[]>([]);
    const [standardDeliveryTime, setStandardDeliveryTime] = useState<number>(0);
    const [standardAmount, setStandardAmount] = useState<number>(0);
    const [standardDescription, setStandardDescription] = useState<string>("");

    // StandardPackage states
    const [superiorRevisions, setSuperiorRevisions] = useState<string>("1");
    const [superiorFeatures, setSuperiorFeatures] = useState<string[]>([]);
    const [superiorDeliveryTime, setSuperiorDeliveryTime] = useState<number>(0);
    const [superiorAmount, setSuperiorAmount] = useState<number>(0);
    const [superiorDescription, setSuperiorDescription] = useState<string>("");

    function constructPost(): PostData {
        const post: PostData = { 
            about: about.trim(), 
            title: title.trim(),
            thumbnail: thumbnail,
            packages: [
                {
                    revisions: basicRevisions,
                    features: basicFeatures.filter((x) => x.trim() !== "").map((x) => x.trim()),
                    deliveryTime: basicDeliveryTime,
                    description: basicDescription,
                    amount: basicAmount,
                    numOrders: 0,
                    type: "BASIC",
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
                type: "STANDARD"
            });
        }

        if (superiorDeliveryTime > 0) {
            post.packages.push({
                revisions: superiorRevisions,
                features: superiorFeatures.filter((x) => x.trim() !== "").map((x) => x.trim()),
                deliveryTime: superiorDeliveryTime,
                description: superiorDescription,
                amount: superiorAmount,
                numOrders: 0,
                type: "SUPERIOR"
            });
        }

        return post;
    }

    async function createPost(): Promise<void> {
        const post: PostData = constructPost();
        const minPrice = post.packages.reduce((acc, cur) => Math.min(cur.amount, acc), Infinity);
        setLoading(true);

        try {
            const resp = await axios.post<{ postID: string, message: string }>(`/api/posts/create`, {
                startingPrice: minPrice,
                post: post
            });

            const addedImages = await addPostImages(resp.data.postID);
            if (addedImages) {
                setErrorMessage("");
                setPostService(false);
                cursor.current = "";
                setUserPosts([]);
                setReachedBottom(false);
                setNextPage((state) => !state);
            }
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            setErrorMessage(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }

    async function addPostImages(postID: string): Promise<boolean> {
        const failed = [];

        for (let i = 0; i < uploadedFiles.length; i++) {
            try {
                const parsedImage = await parseImage(uploadedFiles[i]);
                if (parsedImage !== thumbnail) {
                    await axios.post(`/api/posts/${postID}`, {
                        isThumbnail: false,
                        image: parsedImage,
                        imageNum: i
                    });
                }
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                failed.push({
                    file: uploadedFiles[i], 
                    index: i,
                    errorMessage: errorMessage
                });
            }
        }

        setFailedUploads(failed);
        if (failed.length > 0) {
            setErrorMessage(`Failed to upload ${failed.length} ${failed.length === 1 ? "image" : "images"}.`);
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
                    uploadedFiles={uploadedFiles} 
                    setUploadedFiles={setUploadedFiles}
                />
            );
        case Sections.ChooseThumbnail:
            return (
                <ChooseThumbnail 
                    setSection={setSection} 
                    setPostService={setPostService}
                    uploadedFiles={uploadedFiles}
                    thumbnail={thumbnail}
                    setThumbnail={setThumbnail}
                />
            );
        case Sections.BasicPackage:
            return (
                <Package 
                    setSection={setSection} setRevisions={setBasicRevisions} setFeatures={setBasicFeatures}
                    setDeliveryTime={setBasicDeliveryTime} setDescription={setBasicDescription} 
                    setPostService={setPostService} setAmount={setBasicAmount} features={basicFeatures} 
                    back={Sections.ChooseThumbnail} next={Sections.StandardPackage} deliveryTime={basicDeliveryTime} 
                    title={"Basic package details"} revisions={basicRevisions} description={basicDescription}
                    amount={basicAmount}
                />
            );
        case Sections.StandardPackage:
            return (
                <Package 
                    setSection={setSection} setRevisions={setStandardRevisions} setFeatures={setStandardFeatures}
                    setDeliveryTime={setStandardDeliveryTime} setDescription={setStandardDescription} 
                    setPostService={setPostService} setAmount={setStandardAmount} features={standardFeatures} 
                    back={Sections.BasicPackage} skip={Sections.PostDetails} next={Sections.SuperiorPackage} 
                    deliveryTime={standardDeliveryTime} revisions={standardRevisions} description={standardDescription} 
                    title={"Standard package details"} amount={standardAmount}
                />
            );
        case Sections.SuperiorPackage:
            return (
                <Package 
                    setSection={setSection} setRevisions={setSuperiorRevisions} setFeatures={setSuperiorFeatures}
                    setDeliveryTime={setSuperiorDeliveryTime} setDescription={setSuperiorDescription} setPostService={setPostService}
                    setAmount={setSuperiorAmount} features={superiorFeatures} back={Sections.StandardPackage} skip={Sections.PostDetails} 
                    next={Sections.PostDetails} deliveryTime={superiorDeliveryTime} revisions={superiorRevisions} 
                    description={superiorDescription} title={"Superior package details"} amount={superiorAmount}
                />
            );
        default:
            return (
                <PostDetails 
                    setPostService={setPostService} setSection={setSection}
                    setAbout={setAbout} setTitle={setTitle}
                    about={about} title={title} 
                    errorMessage={errorMessage} loading={loading}
                    createPost={createPost}
                    failedUploads={failedUploads}
                />
            );
    }
}

export default CreatePost;
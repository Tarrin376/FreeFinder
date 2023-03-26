import { useState, useContext } from 'react';
import { UserContext } from "../../context/UserContext";
import { IUserContext } from "../../context/UserContext";
import { IPost } from "../../models/IPost";
import UploadPostFiles from "./UploadPostFiles";
import PostDetails from "./PostDetails";
import ChooseThumbnail from './ChooseThumbnail';
import BasicPackage from './BasicPackage';
import StandardPackage from './StandardPackage';
import SuperiorPackage from './SuperiorPackage';
import { IPackage } from '../../models/IPackage';

interface CreatePostProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setUserPosts: React.Dispatch<React.SetStateAction<IPost[]>>,
    setReachedBottom: React.Dispatch<React.SetStateAction<boolean>>,
    setNextPage: React.Dispatch<React.SetStateAction<boolean>>,
    cursor:  React.MutableRefObject<string>
}

export enum Sections {
    PostDetails,
    UploadFiles,
    ChooseThumbnail,
    BasicPackage,
    StandardPackage,
    SuperiorPackage
}

type PostData = {
    about: string,
    title: string,
    startingPrice: number,
    userID: string,
    packages: IPackage[]
}

function CreatePost({ setPostService, setUserPosts, cursor, setReachedBottom, setNextPage }: CreatePostProps) {
    const [section, setSection] = useState<Sections>(Sections.UploadFiles);
    const userContext: IUserContext = useContext(UserContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // PostDetails states
    const [startingPrice, setStartingPrice] = useState<number>(10);
    const [title, setTitle] = useState<string>("");
    const [about, setAbout] = useState<string>("");

    // UploadedPostFiles states
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    // BasicPackage states
    const [basicRevisions, setBasicRevisions] = useState<string>("1");
    const [basicFeatures, setBasicFeatures] = useState<string[]>([]);
    const [basicDeliveryTime, setBasicDeliveryTime] = useState<number>(0);
    const [basicDescription, setBasicDescription] = useState<string>("");

    // StandardPackage states
    const [standardRevisions, setStandardRevisions] = useState<string>("1");
    const [standardFeatures, setStandardFeatures] = useState<string[]>([]);
    const [standardDeliveryTime, setStandardDeliveryTime] = useState<number>(0);
    const [standardDescription, setStandardDescription] = useState<string>("");

    // StandardPackage states
    const [superiorRevisions, setSuperiorRevisions] = useState<string>("1");
    const [superiorFeatures, setSuperiorFeatures] = useState<string[]>([]);
    const [superiorDeliveryTime, setSuperiorDeliveryTime] = useState<number>(0);
    const [superiorDescription, setSuperiorDescription] = useState<string>("");

    function constructPost(): PostData {
        const post: PostData = { 
            about: about.trim(), 
            title: title.trim(),
            startingPrice: +startingPrice, 
            userID: userContext.userData.userID,
            packages: [
                {
                    revisions: basicRevisions,
                    features: basicFeatures,
                    deliveryTime: basicDeliveryTime,
                    description: basicDescription
                }
            ]
        };

        if (standardDeliveryTime > 0) {
            post.packages.push({
                revisions: standardRevisions,
                features: standardFeatures,
                deliveryTime: standardDeliveryTime,
                description: standardDescription
            });
        }

        if (superiorDeliveryTime > 0) {
            post.packages.push({
                revisions: superiorRevisions,
                features: superiorFeatures,
                deliveryTime: superiorDeliveryTime,
                description: superiorDescription
            });
        }

        return post;
    }

    async function createPost(): Promise<void> {
        setLoading(true);
        const post: PostData = constructPost();

        try {
            const response = await fetch("/api/posts/create", {
                method: 'POST',
                body: JSON.stringify(post),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.status !== 500) {
                const responseData = await response.json();
                if (responseData.message === "success") {
                    setErrorMessage("");
                    setPostService(false);
                    cursor.current = "HEAD";
                    setUserPosts([]);
                    setReachedBottom(false);
                    setNextPage((state) => !state);
                } else {
                    setErrorMessage(responseData.message);
                }
            } else {
                setErrorMessage(`Looks like we are having trouble on our end. Please try again later. 
                (Error code: ${response.status})`);
            }
        }
        catch (err: any) {
            setErrorMessage(err.message);
        }
        finally {
            setLoading(false);
        }
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
                />
            );
        case Sections.BasicPackage:
            return (
                <BasicPackage 
                    setSection={setSection} setPostService={setPostService}
                    setRevisions={setBasicRevisions} setFeatures={setBasicFeatures}
                    setDeliveryTime={setBasicDeliveryTime} setDescription={setBasicDescription}
                    features={basicFeatures} deliveryTime={basicDeliveryTime}
                    revisions={basicRevisions} description={basicDescription}
                />
            );
        case Sections.StandardPackage:
            return (
                <StandardPackage 
                    setSection={setSection} setPostService={setPostService}
                    setRevisions={setStandardRevisions} setFeatures={setStandardFeatures}
                    setDeliveryTime={setStandardDeliveryTime} setDescription={setStandardDescription}
                    features={standardFeatures} deliveryTime={standardDeliveryTime}
                    revisions={standardRevisions} description={standardDescription}
                />
            );
        case Sections.SuperiorPackage:
            return (
                <SuperiorPackage 
                    setSection={setSection} setPostService={setPostService}
                    setRevisions={setSuperiorRevisions} setFeatures={setSuperiorFeatures}
                    setDeliveryTime={setSuperiorDeliveryTime} setDescription={setSuperiorDescription}
                    features={superiorFeatures} deliveryTime={superiorDeliveryTime}
                    revisions={superiorRevisions} description={superiorDescription}
                />
            );
        default:
            return (
                <PostDetails 
                    setPostService={setPostService} setSection={setSection}
                    setAbout={setAbout} setTitle={setTitle}
                    setStartingPrice={setStartingPrice} about={about}
                    title={title} startingPrice={startingPrice}
                    errorMessage={errorMessage} loading={loading}
                    createPost={createPost}
                />
            );
    }
}

export default CreatePost;
import { useState, useContext } from 'react';
import { UserContext } from "../../context/UserContext";
import { IUserContext } from "../../context/UserContext";
import { IPost } from "../../models/IPost";
import UploadPostFiles from "./UploadPostFiles";
import PostDetails from "./PostDetails";
import { Sections } from '../../types/Sections';
import ChooseThumbnail from './ChooseThumbnail';
import BasicPackage from './BasicPackage';

interface CreatePostProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setUserPosts: React.Dispatch<React.SetStateAction<IPost[]>>,
    setReachedBottom: React.Dispatch<React.SetStateAction<boolean>>,
    setNextPage: React.Dispatch<React.SetStateAction<boolean>>,
    cursor:  React.MutableRefObject<string>
}

function CreatePost({ setPostService, setUserPosts, cursor, setReachedBottom, setNextPage }: CreatePostProps) {
    const [section, setSection] = useState<Sections>(Sections.UploadFiles);
    const [startingPrice, setStartingPrice] = useState<number>(10);
    const [title, setTitle] = useState<string>("");
    const [about, setAbout] = useState<string>("");
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const userContext: IUserContext = useContext(UserContext);

    async function createPost(): Promise<void> {
        setLoading(true);
        
        try {
            const response = await fetch(`/posts/create`, {
                method: 'POST',
                body: JSON.stringify({
                    about: about.trim(),
                    title: title.trim(),
                    startingPrice: startingPrice,
                    userID: userContext.userData.userID
                }),
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

    if (section === Sections.UploadFiles) {
        return (
            <UploadPostFiles 
                setPostService={setPostService} 
                setSection={setSection}
                uploadedFiles={uploadedFiles} 
                setUploadedFiles={setUploadedFiles}
            />
        );
    } else if (section === Sections.PostDetails) {
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
    } else if (section === Sections.ChooseThumbnail) {
        return (
            <ChooseThumbnail 
                setSection={setSection} 
                setPostService={setPostService}
                uploadedFiles={uploadedFiles}
            />
        );
    } else {
        return (
            <BasicPackage 
                setSection={setSection} 
                setPostService={setPostService}
            />
        )
    }
}

export default CreatePost;
import PopUpWrapper from "../../layouts/PopUpWrapper";
import ErrorMessage from "../../components/ErrorMessage";
import { categories } from "../../utils/jobCategories";
import LoadingButton from "../../components/LoadingButton";
import { Sections } from "./CreatePost";
import { FailedUpload } from "../../types/FailedUploaded";
import { useState } from "react";
import File from "../../components/File";

interface PostDetailsProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setAbout: React.Dispatch<React.SetStateAction<string>>,
    setTitle: React.Dispatch<React.SetStateAction<string>>, 
    createPost: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>,
    about: string,
    title: string,
    errorMessage: string,
    loading: boolean,
    failedUploads: FailedUpload[]
}

function PostDetails(props: PostDetailsProps) {
    const [showFailedUploads, setShowFailedUploads] = useState<boolean>(false);

    function validInputs(): boolean {
        return props.title.trim().length > 0 && props.about.trim().length > 0;
    }

    const toggleFailedUploads = () => {
        setShowFailedUploads((cur) => !cur);
    }

    return (
        <PopUpWrapper setIsOpen={props.setPostService} title={"Enter post details"}>
            {props.errorMessage !== "" && 
            <ErrorMessage 
                message={props.errorMessage} 
                title={"Unable to create post."} 
                styles="!mb-3"
            />}
            {props.failedUploads.length > 0 && 
            <p className="text-main-blue mb-6 underline cursor-pointer" onClick={toggleFailedUploads}>
                {showFailedUploads ? "Hide all failed images" : "View all failed images"}
            </p>}
            {showFailedUploads && 
            <div className="max-h-[250px] items-center overflow-y-scroll mt-6 mb-6 flex flex-col gap-[15px] scrollbar-hide">
                {props.failedUploads.map((image: FailedUpload, index: number) => {
                    return (
                        <File file={image.file} key={index} description={image.errorMessage} error={true}>
                            <button className="bg-error-red text-error-text btn-primary w-[120px] px-3
                            hover:bg-error-red-hover">
                                Retry
                            </button>
                        </File>
                    )
                })}
            </div>}
            <h3 className="mb-2">What category does your service fall under?</h3>
            <select className="p-2 search-bar cursor-pointer mb-4">
                {Object.keys(categories).map((category, index) => {
                    return (
                        <option key={index}>
                            {category}
                        </option>
                    )
                })}
            </select>
            <h3 className="mb-2">Title</h3>
            <input 
                type="text" 
                className="search-bar mb-4" 
                value={props.title} 
                maxLength={100} 
                placeholder="Enter title" 
                onChange={(e) => props.setTitle(e.target.value)} 
            />
            <h3 className="mb-2">Write about section</h3>
            <textarea 
                placeholder="Write about your service here" 
                className="w-full search-bar mb-6" 
                value={props.about}
                onChange={(e) => props.setAbout(e.target.value)} 
                rows={5} 
                maxLength={1500} 
            />
            <div className="flex justify-end gap-3 mt-[35px]">
                <button className="bg-main-white border-2 border-light-gray btn-primary w-[110px] px-3
                hover:bg-main-white-hover" onClick={() => props.setSection(Sections.BasicPackage)}>
                    Back
                </button>
                <LoadingButton
                    loading={props.loading} text="Post service" loadingText="Creating post"
                    callback={props.createPost} styles={`w-[185px] px-3 ${!validInputs() ? "invalid-button" : "btn-primary action-btn"}`}
                    disabled={!validInputs() || props.loading} loadingColour="bg-[#36BF54]"
                />
            </div>
        </PopUpWrapper>
    );
}

export default PostDetails;
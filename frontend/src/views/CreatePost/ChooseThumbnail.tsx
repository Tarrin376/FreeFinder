import PopUpWrapper from "../../wrappers/PopUpWrapper";
import { CreatePostSections } from "../../enums/CreatePostSections";
import { CreatePostReducerAction } from "./CreatePost";
import ThumbnailImage from "./ThumbnailImage";

interface ChooseThumbnailProps {
    dispatch: React.Dispatch<CreatePostReducerAction>,
    updatePostServicePopUp: (val: boolean) => void,
    uploadedImages: File[],
    thumbnail: File | undefined
}

function ChooseThumbnail({ dispatch, updatePostServicePopUp, uploadedImages, thumbnail }: ChooseThumbnailProps) {
    function changeThumbnail(newThumbnail: File) {
        dispatch({
            payload: { thumbnail: newThumbnail }
        });
    }

    return (
        <PopUpWrapper setIsOpen={updatePostServicePopUp} title="Choose thumbnail" styles="flex flex-col" firstChildStyles="pb-0">
            <div>
                {uploadedImages.length > 0 &&
                <div className="flex flex-col gap-5 flex-grow overflow-y-scroll pr-[8px] max-h-[570px]">
                    {uploadedImages.map((file: File, index: number) => {
                        return (
                            <ThumbnailImage
                                file={file}
                                thumbnail={thumbnail}
                                changeThumbnail={changeThumbnail}
                                key={index}
                            />
                        )
                    })}
                </div>}
                {thumbnail !== undefined && 
                <p className="text-side-text-gray my-5">
                    Selected file:
                    <span className="text-main-blue">{` ${thumbnail.name}`}</span>
                </p>}
            </div>
            <div className="flex gap-3 justify-end">
                <button className="side-btn w-[110px]" onClick={() => dispatch({ payload: { section: CreatePostSections.UploadFiles } })}>
                    Back
                </button>
                <button className={`btn-primary bg-main-blue hover:bg-main-blue-hover text-main-white w-[110px] px-3
                ${!thumbnail ? "pointer-events-none invalid-button" : ""}`}
                onClick={() => dispatch({ payload: { section: CreatePostSections.BasicPackage } })}>
                    Next
                </button>
            </div>
        </PopUpWrapper>
    );
}

export default ChooseThumbnail;
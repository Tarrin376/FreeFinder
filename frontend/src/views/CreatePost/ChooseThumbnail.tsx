import PopUpWrapper from "../../wrappers/PopUpWrapper";
import { Sections } from "./CreatePost";
import { ImageData } from "../../types/ImageData";

interface ChooseThumbnailProps {
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    uploadedImages: ImageData[],
    thumbnail: unknown,
    setThumbnail: React.Dispatch<React.SetStateAction<unknown>>
}

function ChooseThumbnail({ setSection, setPostService, uploadedImages, thumbnail, setThumbnail }: ChooseThumbnailProps) {
    function changeThumbnail(newThumbnail: unknown) {
        setThumbnail(newThumbnail);
    }

    return (
        <PopUpWrapper setIsOpen={setPostService} title={"Choose thumbnail"} styles="flex flex-col">
            {uploadedImages.length > 0 &&
            <div className="mb-9 flex flex-col gap-9 flex-grow overflow-y-scroll scrollbar-hide">
                {uploadedImages.map((imageData: ImageData, index: number) => {
                    return (
                        <div className={`w-full min-h-[300px] h-[300px] bg-center bg-cover rounded-[8px] relative cursor-pointer 
                        border-2 border-light-gray hover:border-light-green transition ease-out duration-200 
                        ${imageData.image === thumbnail ? "border-light-green" : ""}`} 
                        style={{ backgroundImage: `url(${imageData.image})` }} key={index} onClick={() => changeThumbnail(imageData.image)}>
                            {imageData.image === thumbnail && 
                            <p className="absolute top-5 right-5 bg-light-green text-main-white rounded-[5px] px-3 py-[1px]">
                                Use as thumbnail
                            </p>}
                        </div>
                    )
                })}
            </div>}
            <div className="flex gap-3 justify-end">
                <button className="side-btn w-[110px]" onClick={() => setSection(Sections.UploadFiles)}>
                    Back
                </button>
                <button className={`btn-primary bg-main-blue hover:bg-main-blue-hover text-main-white w-[110px] px-3
                ${!thumbnail ? "pointer-events-none invalid-button" : ""}`}
                onClick={() => setSection(Sections.BasicPackage)}>
                    Next
                </button>
            </div>
        </PopUpWrapper>
    );
}

export default ChooseThumbnail;
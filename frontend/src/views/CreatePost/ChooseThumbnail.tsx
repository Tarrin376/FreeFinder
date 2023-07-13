import PopUpWrapper from "../../wrappers/PopUpWrapper";
import { Sections } from "../../enums/Sections";
import { ImageData } from "../../types/ImageData";

interface ChooseThumbnailProps {
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    uploadedImages: ImageData[],
    thumbnail: ImageData | undefined,
    setThumbnail: React.Dispatch<React.SetStateAction<ImageData | undefined>>
}

function ChooseThumbnail({ setSection, setPostService, uploadedImages, thumbnail, setThumbnail }: ChooseThumbnailProps) {
    function changeThumbnail(newThumbnail: ImageData) {
        setThumbnail(newThumbnail);
    }

    return (
        <PopUpWrapper setIsOpen={setPostService} title="Choose thumbnail" styles="flex flex-col">
            {uploadedImages.length > 0 &&
            <div className={`flex flex-col gap-9 flex-grow overflow-y-scroll pr-[8px] max-h-[570px] ${!thumbnail ? "mb-9" : ""}`}>
                {uploadedImages.map((imageData: ImageData, index: number) => {
                    return (
                        <div className={`w-full min-h-[300px] h-[300px] bg-center bg-cover rounded-[8px] relative cursor-pointer 
                        border-2 border-light-border-gray hover:border-main-blue transition ease-out duration-200 
                        ${imageData === thumbnail ? "border-main-blue" : ""}`} 
                        style={{ backgroundImage: `url(${imageData.image})` }} key={index} onClick={() => changeThumbnail(imageData)}>
                            {imageData === thumbnail &&
                            <p className="absolute top-5 right-5 bg-[#0f0f0fb4] text-main-white seller-level">
                                Use as thumbnail
                            </p>}
                        </div>
                    )
                })}
            </div>}
            {thumbnail !== undefined && 
            <p className="text-side-text-gray mt-4 mb-9">
                Selected file:
                <span className="text-main-blue">{` ${thumbnail.file.name}`}</span>
            </p>}
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
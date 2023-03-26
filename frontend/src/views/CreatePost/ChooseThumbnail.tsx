import PopUpWrapper from "../../layouts/PopUpWrapper";
import { Sections } from "./CreatePost";

interface ChooseThumbnailProps {
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    uploadedFiles: File[],
}

function ChooseThumbnail({ setSection, setPostService, uploadedFiles }: ChooseThumbnailProps) {
    return (
        <PopUpWrapper setIsOpen={setPostService} title={"Choose thumbnail"}>
            <div className="flex gap-3 justify-end">
                <button className="bg-main-white border-2 border-light-gray btn-primary w-[110px] px-3
                hover:bg-main-white-hover" onClick={() => setSection(Sections.UploadFiles)}>
                    Back
                </button>
                <button className="btn-primary bg-main-blue hover:bg-main-blue-hover text-main-white w-[110px] px-3"
                onClick={() => setSection(Sections.BasicPackage)}>
                    Next
                </button>
            </div>
        </PopUpWrapper>
    )
}

export default ChooseThumbnail;
import PopUpWrapper from "../../layouts/PopUpWrapper";
import { Sections } from "./CreatePost";
import { useState, useEffect } from "react";
import { parseImage } from "../../utils/parseImage";

interface ChooseThumbnailProps {
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    uploadedFiles: File[],
    thumbnail: unknown,
    setThumbnail: React.Dispatch<React.SetStateAction<unknown>>
}

function ChooseThumbnail({ setSection, setPostService, uploadedFiles, thumbnail, setThumbnail }: ChooseThumbnailProps) {
    const [images, setImages] = useState<unknown[]>([]);

    function changeThumbnail(newThumbnail: unknown) {
        setThumbnail(newThumbnail);
    }

    useEffect(() => {
        (async () => {
            let res = [];
            for (const file of uploadedFiles) {
                const image = await parseImage(file);
                res.push(image);
            }
            
            setImages(res);
        })()
    }, [uploadedFiles, setThumbnail])
    
    return (
        <PopUpWrapper setIsOpen={setPostService} title={"Choose thumbnail"} styles="flex flex-col">
            {images.length > 0 &&
            <div className="mb-9 flex flex-col gap-9 flex-grow overflow-y-scroll">
                {images.map((image, index) => {
                    return (
                        <div className={`w-full min-h-[300px] h-[300px] bg-center bg-cover rounded-[8px] relative cursor-pointer 
                        border-2 border-light-gray hover:border-main-blue transition ease-out duration-200 
                        ${image === thumbnail ? "border-main-blue" : ""}`} 
                        style={{ backgroundImage: `url(${image})` }} key={index} onClick={() => changeThumbnail(image)}>
                            {image === thumbnail && 
                            <p className="absolute top-5 right-5 bg-light-green text-main-white rounded-[6px] px-3">
                                Selected
                            </p>}
                        </div>
                    )
                })}
            </div>}
            <div className="flex gap-3 justify-end">
                <button className="bg-main-white border-2 border-light-gray btn-primary w-[110px] px-3
                hover:bg-main-white-hover" onClick={() => setSection(Sections.UploadFiles)}>
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
import { FailedUpload } from "src/types/FailedUpload";
import UploadedImage from "src/components/UploadedImage";
import Button from "src/components/Button";

interface FailedUploadsProps {
    ignoreUpload: (upload: FailedUpload) => void,
    retryFileUpload: (upload: FailedUpload) => Promise<string | undefined>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    failedUploads: FailedUpload[]
}

function FailedUploads({ ignoreUpload, retryFileUpload, setErrorMessage, failedUploads }: FailedUploadsProps) {
    return (
        <div className="max-h-[250px] items-center overflow-y-scroll mt-5 mb-5 pr-[8px] flex flex-col gap-[15px]">
            {failedUploads.map((upload: FailedUpload, index: number) => {
                return (
                    <UploadedImage file={upload.file} key={index} description={upload.errorMessage} error={true}>
                        <button className="bg-main-white border-2 border-light-border-gray btn-primary w-[120px] px-3
                        hover:bg-main-white-hover" onClick={() => ignoreUpload(upload)}>
                            Ignore
                        </button>
                        <Button
                            action={() => retryFileUpload(upload)}
                            completedText="Uploaded"
                            defaultText="Retry"
                            loadingText="Retrying"
                            styles="red-btn w-[120px] px-3"
                            textStyles="text-error-text"
                            setErrorMessage={setErrorMessage}
                            whenComplete={() => ignoreUpload(upload)}
                            loadingSvgSize={24}
                            loadingSvgColour="#F43C3C"
                            keepErrorMessage={true}
                        />
                    </UploadedImage>
                )
            })}
        </div>
    )
}

export default FailedUploads;
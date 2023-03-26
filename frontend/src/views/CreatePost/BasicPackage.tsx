import { Sections } from "./CreatePost";
import PopUpWrapper from "../../layouts/PopUpWrapper";
import Package from "./Package";

interface BasicPackageProps {
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setRevisions: React.Dispatch<React.SetStateAction<string>>,
    setFeatures: React.Dispatch<React.SetStateAction<string[]>>,
    setDeliveryTime: React.Dispatch<React.SetStateAction<number>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    features: string[],
    deliveryTime: number,
    revisions: string,
    description: string
}

function BasicPackage({ setSection, setPostService, setRevisions, setFeatures, setDeliveryTime, setDescription, 
    features, deliveryTime, revisions, description }: BasicPackageProps) {
    return (
        <PopUpWrapper setIsOpen={setPostService} title={"Basic package details"}>
            <Package
                setSection={setSection} setRevisions={setRevisions} setFeatures={setFeatures} 
                setDeliveryTime={setDeliveryTime} setDescription={setDescription}
                features={features} back={Sections.ChooseThumbnail} 
                next={Sections.StandardPackage} deliveryTime={deliveryTime}
                revisions={revisions} description={description}
            />
        </PopUpWrapper>
    );
}

export default BasicPackage;
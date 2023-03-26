import { Sections } from "./CreatePost";
import PopUpWrapper from "../../layouts/PopUpWrapper";
import Package from "./Package";

interface StandardPackageProps {
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setRevisions: React.Dispatch<React.SetStateAction<string>>,
    setFeatures: React.Dispatch<React.SetStateAction<string[]>>,
    setDeliveryTime: React.Dispatch<React.SetStateAction<number>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    features: string[],
}

function StandardPackage({ setSection, setPostService, setRevisions, setFeatures, setDeliveryTime, setDescription, features }: StandardPackageProps) {
    return (
        <PopUpWrapper setIsOpen={setPostService} title={"Standard package details"}>
            <Package
                setSection={setSection} setRevisions={setRevisions} setFeatures={setFeatures} 
                setDeliveryTime={setDeliveryTime} setDescription={setDescription}
                features={features} back={Sections.BasicPackage} 
                skip={Sections.PostDetails} next={Sections.SuperiorPackage}
            />
        </PopUpWrapper>
    );
}

export default StandardPackage;
import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useState, useContext } from 'react';
import { IUserContext, UserContext } from "../providers/UserContext";
import ErrorMessage from "./ErrorMessage";
import axios, { AxiosError } from "axios";
import { ISeller } from "../models/ISeller";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import Button from "./Button";
import SearchLanguages from "./SearchLanguages";
import Options from "./Options";

const MAX_DESC_CHARS = 650;
const MAX_SUMMARY_CHARS = 50;
const MAX_NUMBER_OF_SKILLS = 15;

interface ChangeSellerDetailsProps {
    setSellerProfilePopUp: React.Dispatch<React.SetStateAction<boolean>>,
}

function ChangeSellerDetails({ setSellerProfilePopUp }: ChangeSellerDetailsProps) {
    const userContext = useContext<IUserContext>(UserContext);
    const [description, setDescription] = useState<string>(userContext.userData.seller!.description);
    const [summary, setSummary] = useState<string>(userContext.userData.seller!.summary);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(userContext.userData.seller!.languages);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [skill, setSkill] = useState<string>("");
    const [skills, setSkills] = useState<string[]>(userContext.userData.seller!.skills);
    
    function closeSellerProfilePopUp(): void {
        setSellerProfilePopUp(false);
    }

    async function updateSellerDetails(): Promise<string | undefined> {
        try {
            const resp = await axios.put<{ updatedData: ISeller, message: string }>(`/api/sellers/${userContext.userData.seller?.sellerID}`, {
                description: description,
                languages: selectedLanguages,
                skills: skills,
                summary: summary
            });

            userContext.setUserData({ 
                ...userContext.userData, 
                seller: { ...resp.data.updatedData }
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    function addSkill(): void {
        if (skills.length === MAX_NUMBER_OF_SKILLS) {
            setErrorMessage(`You cannot have more than ${MAX_NUMBER_OF_SKILLS} skills on your profile.`);
            return;
        }

        const newSkill = skill.toLowerCase();
        setSkills((skills: string[]) => [...skills.filter(x => x !== newSkill), newSkill]);
        setSkill("");
    }

    function removeSkill(skill: string): void {
        setSkills((skills: string[]) => skills.filter(x => x !== skill));
    }

    return (
        <PopUpWrapper setIsOpen={setSellerProfilePopUp} title="Seller Profile">
            {errorMessage !== "" && 
            <ErrorMessage 
                message={errorMessage} 
                title="Unable to update seller profile"
                setErrorMessage={setErrorMessage}
            />}
            <p className="mb-2">
                Seller summary 
                <span className="text-side-text-gray">
                    {` (Max ${MAX_SUMMARY_CHARS} characters)`}
                </span>
            </p>
            <input 
                className="search-bar mb-4" 
                placeholder="Summarize your work"
                onChange={(e) => setSummary(e.target.value)}
                value={summary}
                maxLength={MAX_SUMMARY_CHARS}
            />
            <p className="mb-2">
                Seller description 
                <span className="text-side-text-gray">
                    {` (Max ${MAX_DESC_CHARS} characters)`}
                </span>
            </p>
            <textarea
                rows={7} 
                className="search-bar mb-4" 
                value={description}
                maxLength={MAX_DESC_CHARS} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what services you provide and what you can offer"
            />
            <p className="mb-2">Languages you speak</p>
            <SearchLanguages 
                setSelectedLanguages={setSelectedLanguages} 
                selectedLanguages={selectedLanguages} 
            />
            <p className="mb-2 mt-4">Your skills</p>
            <input 
                type="text" 
                className="search-bar"
                placeholder="Enter a skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
            />
            {skill !== "" &&
            <button className="side-btn w-fit !h-[30px] rounded-[6px] mt-4" onClick={addSkill}>
                Add skill
            </button>}
            <Options
                options={skills}
                removeOption={removeSkill}
                bgColour="bg-very-light-pink"
                textColour="#bf01ff"
                styles="mt-4"
            />
            <Button
                action={updateSellerDetails}
                completedText="Seller profile updated"
                defaultText="Update seller profile"
                loadingText="Updating seller profile"
                styles={`main-btn mt-[35px] ${selectedLanguages.length === 0 ? "invalid-button" : ""}`}
                textStyles="text-main-white"
                setErrorMessage={setErrorMessage}
                whenComplete={closeSellerProfilePopUp}
                loadingSvgSize={28}
            />
        </PopUpWrapper>
    );
}

export default ChangeSellerDetails;
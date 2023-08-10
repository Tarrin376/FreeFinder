import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useState, useContext } from 'react';
import { IUserContext, UserContext } from "../providers/UserProvider";
import ErrorPopUp from "./ErrorPopUp";
import axios, { AxiosError } from "axios";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import Button from "./Button";
import SearchLanguages from "./SearchLanguages";
import Options from "./Options";
import { IUser } from "../models/IUser";
import { AnimatePresence } from "framer-motion";
import { MAX_SELLER_DESC_CHARS, MAX_SELLER_SUMMARY_CHARS, MAX_SELLER_SKILLS } from "@freefinder/shared/dist/constants";

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
            const resp = await axios.put<{ updatedData: IUser["seller"], message: string }>(`/api/sellers/${userContext.userData.seller?.sellerID}`, {
                description: description,
                languages: selectedLanguages,
                skills: skills,
                summary: summary
            });

            userContext.setUserData({ 
                ...userContext.userData, 
                seller: resp.data.updatedData
            });
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    function addSkill(): void {
        if (skills.length === MAX_SELLER_SKILLS) {
            setErrorMessage(`You cannot have more than ${MAX_SELLER_SKILLS} skills on your profile.`);
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
            <div>
                <AnimatePresence>
                    {errorMessage !== "" && 
                    <ErrorPopUp 
                        errorMessage={errorMessage} 
                        setErrorMessage={setErrorMessage}
                    />}
                </AnimatePresence>
                <p className="mb-2">
                    Seller summary 
                    <span className="text-side-text-gray">
                        {` (Max ${MAX_SELLER_SUMMARY_CHARS} characters)`}
                    </span>
                </p>
                <input 
                    className="search-bar mb-4" 
                    placeholder="Summarize your work"
                    onChange={(e) => setSummary(e.target.value)}
                    value={summary}
                    maxLength={MAX_SELLER_SUMMARY_CHARS}
                />
                <p className="mb-2">
                    Seller description 
                    <span className="text-side-text-gray">
                        {` (Max ${MAX_SELLER_DESC_CHARS} characters)`}
                    </span>
                </p>
                <textarea
                    rows={7} 
                    className="search-bar mb-4" 
                    value={description}
                    maxLength={MAX_SELLER_DESC_CHARS} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what services you provide and what you can offer"
                />
                <p className="mb-2">Languages you speak</p>
                <SearchLanguages 
                    updateLanguages={setSelectedLanguages}
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
                <button className="side-btn w-fit !h-[30px] rounded-[6px] mt-4 text-[15px]" onClick={addSkill}>
                    Add skill
                </button>}
                <Options
                    options={skills}
                    removeOption={removeSkill}
                    styles="bg-very-light-pink"
                    textColour="#bf01ff"
                    wrapperStyles="mt-4"
                />
            </div>
            <Button
                action={updateSellerDetails}
                completedText="Seller profile updated"
                defaultText="Update seller profile"
                loadingText="Updating seller profile"
                styles={`main-btn ${selectedLanguages.length === 0 ? "invalid-button" : ""}`}
                textStyles="text-main-white"
                setErrorMessage={setErrorMessage}
                whenComplete={closeSellerProfilePopUp}
                loadingSvgSize={28}
            />
        </PopUpWrapper>
    );
}

export default ChangeSellerDetails;
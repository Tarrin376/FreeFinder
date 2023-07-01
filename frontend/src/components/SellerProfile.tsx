import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useState, useContext } from 'react';
import { IUserContext, UserContext } from "../providers/UserContext";
import ErrorMessage from "./ErrorMessage";
import axios, { AxiosError } from "axios";
import { ISeller } from "../models/ISeller";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import Button from "./Button";
import { useFetchLanguages } from "../hooks/useFetchLanguages";
import CloseIcon from "../assets/close.png";

const MAX_DESC_CHARS = 250;

interface SellerProfileProps {
    setSellerProfilePopUp: React.Dispatch<React.SetStateAction<boolean>>,
}

function SellerProfile({ setSellerProfilePopUp }: SellerProfileProps) {
    const [description, setDescription] = useState<string>("");
    const userContext = useContext<IUserContext>(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [language, setLanguage] = useState<string>("");
    const [matchedLanguages, setMatchedLanguages] = useState<string[][]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const allLanguages = useFetchLanguages();
    
    function closeSellerProfilePopUp(): void {
        setSellerProfilePopUp(false);
    }

    async function updateSellerDetails(): Promise<string | undefined> {
        try {
            const resp = await axios.put<{ updatedData: ISeller, message: string }>(`/api/sellers/${userContext.userData.username}`, {
                description: description,
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

    function getMatchedLanguages(search: string): string[][] {
        if (search === "") {
            return [];
        }

        const res = allLanguages.languages.map((language: string) => {
            const index = language.indexOf(search.toLowerCase());
            if (index !== -1) return [language, index.toString()];
            else return [];
        });

        return res.filter((cur: string[]) => cur.length > 0);
    }

    function searchHandler(e: React.ChangeEvent<HTMLInputElement>): void {
        const search = e.target.value;
        const matched = getMatchedLanguages(search);
        setMatchedLanguages(matched);
        setLanguage(search);
    }

    function addLanguage(language: string): void {
        setSelectedLanguages((selected: string[]) => [
            ...selected.filter((curLang: string) => curLang !== language), 
            language
        ]);
    }

    function removeLanguage(language: string): void {
        console.log(language);
        setSelectedLanguages((selected: string[]) => selected.filter((curLang: string) => curLang !== language));
    }

    return (
        <PopUpWrapper setIsOpen={setSellerProfilePopUp} title={"Seller Profile"}>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"Unable to update seller profile"} />}
            <p className="mb-2">
                Seller description 
                <span className="text-side-text-gray">
                    {` (Max ${MAX_DESC_CHARS} characters)`}
                </span>
            </p>
            <textarea rows={7} className="search-bar mb-4" defaultValue={userContext.userData.seller.description} 
            maxLength={MAX_DESC_CHARS} onChange={(e) => setDescription(e.target.value)} />
            <p className="mb-2">Languages you speak</p>
            <input 
                type="text" 
                className={`search-bar ${matchedLanguages.length > 0 ? "!rounded-b-none" : ""} focus:!outline-none`}
                placeholder="Search for a language" 
                value={language}
                onChange={searchHandler}
            />
            {matchedLanguages.length > 0 &&
            <div className="border-b border-x border-light-gray rounded-b-[8px] max-h-[300px] overflow-y-scroll p-4">
                <p className="text-[16px] text-side-text-gray mb-2">{`Results for '${language}'`}</p>
                <div className="flex flex-col gap-1">
                    {matchedLanguages.map((cur: string[]) => {
                        const index = parseInt(cur[1]);
                        const result = cur[0].split('');

                        return (
                            <p className="font-semibold cursor-pointer transition-all ease-linear duration-100 hover:px-2"
                            onClick={() => addLanguage(cur[0])}>
                                {result.map((char: string, curIndex: number) => {
                                    return (
                                        <span className={curIndex >= index && curIndex < index + language.length ? "bg-highlight" : ""}>
                                            {char}
                                        </span>
                                    )
                                })}
                            </p>
                        )
                    })}
                </div>
            </div>}
            {selectedLanguages.length > 0 &&
            <div className="mt-4 flex items-center gap-3 flex-wrap">
                {selectedLanguages.map((cur: string) => {
                    return (
                        <div className="rounded-full py-1 px-3 bg-highlight flex items-center gap-2 cursor-pointer" 
                        onClick={() => removeLanguage(cur)}>
                            <p className="text-sm">{cur}</p>
                            <img src={CloseIcon} className="w-[13px] h-[13px] mt-[1px]" alt="" />
                        </div>
                    )
                })}
            </div>}
            <Button
                action={updateSellerDetails}
                completedText="Seller profile updated"
                defaultText="Update seller profile"
                loadingText="Updating seller profile"
                styles="main-btn mt-[35px]"
                textColor="text-main-white"
                setErrorMessage={setErrorMessage}
                whenComplete={closeSellerProfilePopUp}
            />
        </PopUpWrapper>
    );
}

export default SellerProfile;
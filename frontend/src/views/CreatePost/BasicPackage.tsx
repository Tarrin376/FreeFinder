import PopUpWrapper from "../../layouts/PopUpWrapper";
import { Sections } from "../../types/Sections";
import { useState } from "react";

interface BasicPackageProps {
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
}

const MAX_REVISIONS = 7;
const MAX_FEATURES = 7;

function BasicPackage({ setSection, setPostService }: BasicPackageProps) {
    const [revisions, setRevisions] = useState<string>("1");
    const [features, setFeatures] = useState<string[]>([]);

    function updateFeatureInput(index: number, value: string) {
        const cpy = [...features];
        cpy[index] = value;
        setFeatures(cpy);
    }

    function addNewFeature() {
        if (features.length < MAX_FEATURES) {
            setFeatures((state) => [...state, ""]);
        }
    }

    return (
        <PopUpWrapper setIsOpen={setPostService} title={"Basic package details"}>
            <h3 className="mb-2">Delivery time (in days)</h3>
            <input type="number" min={1} max={360} placeholder="Must be between 1 and 360 days" className="search-bar mb-4" />
            <h3 className="mb-2">Amount of revisions</h3>
            <ul className="items-center w-full text-sm flex bg-[#f0f2f3] rounded-[8px] px-2 mb-4">
                {new Array(MAX_REVISIONS).fill(true).map((_, index) => {
                    return (
                        <RevisionListItem numRevisions={index + 1} setRevisions={setRevisions} />
                    );
                })}
                <RevisionListItem numRevisions={"unlimited"} styles={"flex-grow"} setRevisions={setRevisions} />
            </ul>
            <h3 className="mb-2">Brief description of the package</h3>
            <textarea placeholder="Write about the basic package here" className="w-full search-bar mb-4" 
            rows={5} maxLength={250} />
            <h3 className="mb-1">Features that come with your basic package</h3>
            <p className="text-side-text-gray mb-3">Features added:
                <span className={features.length === MAX_FEATURES ? 'text-error-text' : 'text-[#36BF54]'}>
                    {` ${features.length} / ${MAX_FEATURES}`}
                </span>
            </p>
            <button className="btn-primary bg-main-purple hover:bg-main-purple-hover text-main-white w-[140px] px-3 mb-5"
            onClick={addNewFeature}>
                Add Feature
            </button>
            {features.length > 0 && <div className="flex flex-col gap-2 max-h-[200px] overflow-scroll 
            scrollbar-hide p-[8px] bg-[#f0f2f3] rounded-[8px]">
                {features.map((value, index) => {
                    return (
                        <input type="text" className="search-bar" defaultValue={value} placeholder={"E.g. Video Thumbnail included"}
                        onChange={(e) => updateFeatureInput(index, e.target.value)} />
                    )
                })}
            </div>}
            <div className="flex gap-3 justify-end mt-[35px]">
                <button className="bg-main-white border-2 border-light-gray btn-primary w-[110px] px-3
                hover:bg-main-white-hover" onClick={() => setSection(Sections.ChooseThumbnail)}>
                    Back
                </button>
                <button className="btn-primary bg-main-purple hover:bg-main-purple-hover text-main-white w-[110px] px-3"
                onClick={() => setSection(Sections.PostDetails)}>
                    Next
                </button>
            </div>
        </PopUpWrapper>
    )
}

function RevisionListItem({ numRevisions, styles, setRevisions }: 
    { numRevisions: number | string, styles?: string, setRevisions: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <li className={styles}>
            <div className="flex items-center px-2 justify-center">
                <input id="horizontal-list-radio-passport" type="radio" value={numRevisions} name="list-radio" 
                className="w-4 h-4 text-main-purple focus:!text-main-purple" onChange={(e) => setRevisions(e.currentTarget.value)} />
                <label htmlFor="horizontal-list-radio-passport" className="w-fit py-3 ml-2 text-sm font-medium text-main-black">{numRevisions}</label>
            </div>
        </li>
    )
}

export default BasicPackage;
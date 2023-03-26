import { Sections } from "./CreatePost";
import { checkIsNumeric } from "../../utils/checkIsNumeric";

interface PackageProps {
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setRevisions: React.Dispatch<React.SetStateAction<string>>,
    setFeatures: React.Dispatch<React.SetStateAction<string[]>>,
    setDeliveryTime: React.Dispatch<React.SetStateAction<number>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    features: string[],
    back: Sections,
    skip?: Sections,
    next: Sections,
    deliveryTime: number,
    revisions: string,
    description: string
}

const MAX_REVISIONS = 5;
const MAX_FEATURES = 7;
const MAX_DELIVERY_DAYS = 360;
 
function Package({ setSection, setRevisions, setFeatures, setDeliveryTime, setDescription, features, back, 
    skip, next, deliveryTime, revisions, description }: PackageProps) {
    function updateFeatureInput(index: number, value: string) {
        setFeatures((state) => {
            const cpy = [...state];
            cpy[index] = value; 
            return cpy;
        });
    }

    function addNewFeature() {
        if (features.length < MAX_FEATURES) {
            setFeatures((state) => [...state, ""]);
        }
    }

    function updateDeliveryTime(e: React.ChangeEvent<HTMLInputElement>) {
        const deliveryTime = e.target.value;
        if (checkIsNumeric(deliveryTime, MAX_DELIVERY_DAYS)) {
            setDeliveryTime(+deliveryTime);
        } else {
            setDeliveryTime(0);
        }
    }

    function updateDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const description = e.target.value;
        setDescription(description);
    }

    function updateRevision(e: React.ChangeEvent<HTMLInputElement>) {
        const revision = e.target.value;
        setRevisions(revision);
    }

    function checkInputs() {
        return description.length > 0 && deliveryTime > 0;
    }

    function skipPackage() {
        setDeliveryTime(0);
        setDescription("");
        setRevisions("1");

        if (skip !== undefined) {
            setSection(skip);
        }
    }

    return (
        <>
            <h3 className="mb-2">Delivery time (in days)</h3>
            <input type="number" min={1} max={360} placeholder="Must be between 1 and 360 days" defaultValue={deliveryTime} className="search-bar mb-4" onChange={updateDeliveryTime} />
            <h3 className="mb-2">Amount of revisions</h3>
            <ul className="items-center w-fit text-sm flex bg-[#f8f9fa] rounded-[8px] px-2 mb-4">
                {new Array(MAX_REVISIONS).fill(true).map((_, index) => {
                    return (
                        <RevisionListItem 
                            curRevision={"" + (index + 1)} 
                            updateRevision={updateRevision} 
                            revisions={revisions} 
                        />
                    );
                })}
                <RevisionListItem 
                    curRevision={"unlimited"} 
                    updateRevision={updateRevision} 
                    revisions={revisions} 
                />
            </ul>
            <h3 className="mb-2">Brief description of the package</h3>
            <textarea placeholder="Write about the basic package here" className="w-full search-bar mb-4" 
            rows={5} maxLength={250} onChange={updateDescription} defaultValue={description} />
            <h3 className="mb-1">Features that come with your basic package</h3>
            <p className="text-side-text-gray mb-3">Features added:
                <span className={features.length === MAX_FEATURES ? 'text-error-text' : 'text-[#36BF54]'}>
                    {` ${features.length} / ${MAX_FEATURES}`}
                </span>
            </p>
            <button className="btn-primary bg-main-black hover:bg-main-black-hover 
            text-main-white w-[140px] px-3 mb-5" onClick={addNewFeature}>
                Add Feature
            </button>
            {features.length > 0 && 
            <div className="flex flex-col gap-2 max-h-[200px] overflow-scroll 
            scrollbar-hide p-[8px] bg-[#f8f9fa] rounded-[8px]">
                {features.map((value, index) => {
                    return (
                        <input type="text" className="search-bar" defaultValue={value} placeholder={"E.g. Video Thumbnail included"}
                        onChange={(e) => updateFeatureInput(index, e.target.value)} />
                    )
                })}
            </div>}
            <div className="flex gap-3 justify-end mt-[35px]">
                {skip !== undefined && <button className="bg-main-white border-2 border-light-gray 
                btn-primary w-[110px] px-3 hover:bg-main-white-hover" onClick={skipPackage}>
                    Skip
                </button>}
                <button className="bg-main-white border-2 border-light-gray btn-primary 
                w-[110px] px-3hover:bg-main-white-hover" onClick={() => setSection(back)}>
                    Back
                </button>
                <button className={`btn-primary bg-main-blue hover:bg-main-blue-hover 
                text-main-white w-[110px] px-3 ${!checkInputs() ? "invalid-button" : ""}`}
                onClick={() => setSection(next)} disabled={!checkInputs()}>
                    Next
                </button>
            </div>
        </>
    )
}

function RevisionListItem({ curRevision, updateRevision, revisions }: { curRevision: string, 
    updateRevision: React.ChangeEventHandler<HTMLInputElement>, revisions: string }) {
    return (
        <li className="flex items-center px-2 justify-center">
            <input id="horizontal-list-radio-passport" type="radio" checked={revisions === curRevision} value={curRevision} name="list-radio" 
            className="w-4 h-4 text-main-blue focus:!text-main-blue" onChange={updateRevision} />
            <label htmlFor="horizontal-list-radio-passport" className="w-fit py-3 ml-2 text-sm font-medium text-main-black">
                {curRevision}
            </label>
        </li>
    )
}

export default Package;
import { Sections } from "./CreatePost";

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
}

const MAX_REVISIONS = 5;
const MAX_FEATURES = 7;
 
function Package({ setSection, setRevisions, setFeatures, setDeliveryTime, setDescription, features, back, skip, next }: PackageProps) {
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
        const deliveryTime = +e.target.value;
        setDeliveryTime(deliveryTime);
    }

    function updateDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const description = e.target.value;
        setDescription(description);
    }

    function updateRevision(e: React.ChangeEvent<HTMLInputElement>) {
        const revision = e.target.value;
        setRevisions(revision);
    }

    return (
        <>
            <h3 className="mb-2">Delivery time (in days)</h3>
            <input type="number" min={1} max={360} placeholder="Must be between 1 and 360 days" className="search-bar mb-4" onChange={updateDeliveryTime} />
            <h3 className="mb-2">Amount of revisions</h3>
            <ul className="items-center w-fit text-sm flex bg-[#f8f9fa] rounded-[8px] px-2 mb-4">
                {new Array(MAX_REVISIONS).fill(true).map((_, index) => {
                    return (
                        <RevisionListItem numRevisions={index + 1} updateRevision={updateRevision} />
                    );
                })}
                <RevisionListItem numRevisions={"unlimited"} updateRevision={updateRevision} />
            </ul>
            <h3 className="mb-2">Brief description of the package</h3>
            <textarea placeholder="Write about the basic package here" className="w-full search-bar mb-4" 
            rows={5} maxLength={250} onChange={updateDescription} />
            <h3 className="mb-1">Features that come with your basic package</h3>
            <p className="text-side-text-gray mb-3">Features added:
                <span className={features.length === MAX_FEATURES ? 'text-error-text' : 'text-[#36BF54]'}>
                    {` ${features.length} / ${MAX_FEATURES}`}
                </span>
            </p>
            <button className="btn-primary bg-main-black hover:bg-main-black-hover text-main-white w-[140px] px-3 mb-5"
            onClick={addNewFeature}>
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
                {skip !== undefined && <button className="bg-main-white border-2 border-light-gray btn-primary w-[110px] px-3
                hover:bg-main-white-hover" onClick={() => setSection(skip)}>
                    Skip
                </button>}
                <button className="bg-main-white border-2 border-light-gray btn-primary w-[110px] px-3
                hover:bg-main-white-hover" onClick={() => setSection(back)}>
                    Back
                </button>
                <button className="btn-primary bg-main-blue hover:bg-main-blue-hover text-main-white w-[110px] px-3"
                onClick={() => setSection(next)}>
                    Next
                </button>
            </div>
        </>
    )
}

function RevisionListItem({ numRevisions, updateRevision }: { numRevisions: number | string, 
    updateRevision: React.ChangeEventHandler<HTMLInputElement> }) {
    return (
        <li className="flex items-center px-2 justify-center">
            <input id="horizontal-list-radio-passport" type="radio" value={numRevisions} name="list-radio" 
            className="w-4 h-4 text-main-blue focus:!text-main-blue" onChange={updateRevision} />
            <label htmlFor="horizontal-list-radio-passport" className="w-fit py-3 ml-2 text-sm font-medium text-main-black">{numRevisions}</label>
        </li>
    )
}

export default Package;
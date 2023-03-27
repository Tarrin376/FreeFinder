import { Sections } from "./CreatePost";
import { checkIsNumeric } from "../../utils/checkIsNumeric";
import PopUpWrapper from "../../layouts/PopUpWrapper";

interface PackageProps {
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setRevisions: React.Dispatch<React.SetStateAction<string>>,
    setFeatures: React.Dispatch<React.SetStateAction<string[]>>,
    setDeliveryTime: React.Dispatch<React.SetStateAction<number>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setAmount: React.Dispatch<React.SetStateAction<number>>,
    features: string[],
    back: Sections,
    skip?: Sections,
    next: Sections,
    deliveryTime: number,
    revisions: string,
    description: string,
    title: string,
    amount: number
}

const MAX_REVISIONS = 5;
const MAX_FEATURES = 10;
const MAX_DELIVERY_DAYS = 360;
const MAX_PRICE: number = 2500;
 
function Package({ setSection, setRevisions, setFeatures, setDeliveryTime, setDescription, setPostService, setAmount, features, back, 
    skip, next, deliveryTime, revisions, description, title, amount }: PackageProps) {

    function updateFeatureInput(index: number, value: string): void {
        setFeatures((state) => {
            const cpy = [...state];
            cpy[index] = value.trimStart();
            return cpy;
        });
    }

    function addNewFeature(): void {
        if (features.length < MAX_FEATURES) {
            setFeatures((state) => [...state, ""]);
        }
    }

    function updateDeliveryTime(e: React.ChangeEvent<HTMLInputElement>): void {
        const deliveryTime = e.target.value;
        if (checkIsNumeric(deliveryTime, MAX_DELIVERY_DAYS)) {
            setDeliveryTime(+deliveryTime);
        } else {
            setDeliveryTime(0);
        }
    }

    function updateDescription(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        const description = e.target.value.trimStart();
        setDescription(description);
    }

    function updateRevision(e: React.ChangeEvent<HTMLInputElement>): void {
        const revision = e.target.value;
        setRevisions(revision);
    }

    function updatePackageAmount(e: React.ChangeEvent<HTMLInputElement>): void {
        const packageAmount = e.target.value;
        if (checkIsNumeric(packageAmount, MAX_PRICE)) {
            setAmount(+packageAmount);
        } else {
            setAmount(0);
        }
    }

    function checkInputs(): boolean {
        return description.length > 0 && deliveryTime > 0 && amount > 0;
    }

    function skipPackage(): void {
        setDeliveryTime(0);
        setDescription("");
        setRevisions("1");
        setAmount(0);

        if (skip !== undefined) {
            setSection(skip);
        }
    }

    return (
        <PopUpWrapper setIsOpen={setPostService} title={title}>
            <h3 className="mb-2">Package cost (estimate)</h3>
            <div className="flex items-center search-bar mb-4">
                <p className="select-none">£</p>
                <input type="text" min={1} max={2500} value={amount > 0 ? amount : ""} className="w-full h-full 
                focus:outline-none placeholder-search-text bg-transparent ml-3" onChange={updatePackageAmount} />
            </div>
            <h3 className="mb-2">Delivery time (in days)</h3>
            <input type="text" min={1} max={360} placeholder="Must be between 1 and 360 days"
            className="search-bar mb-4" onChange={updateDeliveryTime} value={deliveryTime > 0 ? deliveryTime : ""} />
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
            rows={5} maxLength={250} onChange={updateDescription} value={description} />
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
            <div className="flex flex-col gap-2 max-h-[200px] overflow-scroll scrollbar-hide p-[8px] bg-[#f8f9fa] rounded-[8px]">
                {features.map((value, index) => {
                    return (
                        <input type="text" className="search-bar" value={value} placeholder={"E.g. Video Thumbnail included"}
                        onChange={(e) => updateFeatureInput(index, e.target.value)} />
                    );
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
        </PopUpWrapper>
    );
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
    );
}

export default Package;
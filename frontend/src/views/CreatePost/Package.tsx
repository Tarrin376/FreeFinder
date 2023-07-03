import { Sections } from "./CreatePost";
import { checkIsNumeric } from "../../utils/checkIsNumeric";
import PopUpWrapper from "../../wrappers/PopUpWrapper";

interface PackageProps {
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setRevisions: React.Dispatch<React.SetStateAction<string>>,
    setFeatures: React.Dispatch<React.SetStateAction<string[]>>,
    setDeliveryTime: React.Dispatch<React.SetStateAction<number>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setPackageTitle: React.Dispatch<React.SetStateAction<string>>,
    setAmount: React.Dispatch<React.SetStateAction<number>>,
    features: string[],
    back: Sections,
    skip?: Sections,
    next: Sections,
    deliveryTime: number,
    revisions: string,
    description: string,
    title: string,
    packageTitle: string,
    amount: number
}

export const MAX_PRICE: number = 2500;

const MAX_REVISIONS = 5;
const MAX_FEATURES = 10;
export const MAX_DELIVERY_DAYS = 60;

function Package(props: PackageProps) {
    function updateFeatureInput(index: number, value: string): void {
        props.setFeatures((state) => {
            const cpy = [...state];
            cpy[index] = value.trimStart();
            return cpy;
        });
    }

    function addNewFeature(): void {
        if (props.features.length < MAX_FEATURES) {
            props.setFeatures((state) => [...state, ""]);
        }
    }

    function updateDeliveryTime(e: React.ChangeEvent<HTMLInputElement>): void {
        const deliveryTime = e.target.value;
        if (checkIsNumeric(deliveryTime, MAX_DELIVERY_DAYS)) {
            props.setDeliveryTime(+deliveryTime);
        }
    }

    function updateDescription(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        const description = e.target.value.trimStart();
        props.setDescription(description);
    }

    function updateRevision(e: React.ChangeEvent<HTMLInputElement>): void {
        const revision = e.target.value;
        props.setRevisions(revision);
    }

    function updatePackageAmount(e: React.ChangeEvent<HTMLInputElement>): void {
        const packageAmount = e.target.value;
        if (checkIsNumeric(packageAmount, MAX_PRICE)) {
            props.setAmount(+packageAmount);
        }
    }

    function checkInputs(): boolean {
        return props.description.length > 0 && props.deliveryTime > 0 && props.amount > 0 && props.packageTitle.length > 0;
    }

    function skipPackage(): void {
        props.setDeliveryTime(0);
        props.setDescription("");
        props.setRevisions("1");
        props.setAmount(0);
        props.setPackageTitle("");

        if (props.skip !== undefined) {
            props.setSection(props.skip);
        }
    }

    function updateTitle(e: React.ChangeEvent<HTMLInputElement>): void {
        const pkgTitle = e.target.value;
        props.setPackageTitle(pkgTitle);
    }

    return (
        <PopUpWrapper setIsOpen={props.setPostService} title={props.title}>
            <h3 className="mb-2">Title</h3>
            <input 
                type="text"
                placeholder="Enter title of package"
                className="search-bar mb-4"
                onChange={updateTitle}
                value={props.packageTitle}
                maxLength={70}
            />
            <h3 className="mb-2">{`Package cost (£1 - £${MAX_PRICE})`}</h3>
            <div className="flex items-center search-bar mb-4">
                <p className="select-none">£</p>
                <input 
                    type="text" 
                    min={1} 
                    max={2500} 
                    value={props.amount > 0 ? props.amount : ""} 
                    className="w-full h-full focus:outline-none 
                    placeholder-search-text bg-transparent ml-3" 
                    onChange={updatePackageAmount} 
                />
            </div>
            <h3 className="mb-2">Delivery time (in days)</h3>
            <input 
                type="text" 
                min={1} 
                max={360} 
                placeholder={`Must be between 1 and ${MAX_DELIVERY_DAYS} days`}
                className="search-bar mb-4" 
                onChange={updateDeliveryTime} 
                value={props.deliveryTime > 0 ? props.deliveryTime : ""} 
            />
            <h3 className="mb-2">Amount of revisions</h3>
            <ul className="items-center w-fit text-sm flex bg-[#f7f7f7] rounded-[8px] px-2 mb-4">
                {new Array(MAX_REVISIONS).fill(true).map((_, index) => {
                    return (
                        <RevisionListItem 
                            curRevision={"" + (index + 1)} 
                            updateRevision={updateRevision} 
                            revisions={props.revisions} 
                            key={index}
                        />
                    );
                })}
                <RevisionListItem 
                    curRevision={"unlimited"} 
                    updateRevision={updateRevision} 
                    revisions={props.revisions}
                />
            </ul>
            <h3 className="mb-2">Brief description of the package</h3>
            <textarea 
                placeholder="Write about the basic package here" 
                className="w-full search-bar mb-4" 
                rows={5} 
                maxLength={250} 
                onChange={updateDescription} 
                value={props.description} 
            />
            <h3 className="mb-1">{`Features that come with your ${props.title.toLowerCase()}`}</h3>
            <p className="text-side-text-gray mb-3">Features added:
                <span className={props.features.length === MAX_FEATURES ? 'text-error-text' : 'text-[#36BF54]'}>
                    {` ${props.features.length} / ${MAX_FEATURES}`}
                </span>
            </p>
            <button className="btn-primary bg-main-black hover:bg-main-black-hover 
            text-main-white w-[140px] px-3" onClick={addNewFeature}>
                Add Feature
            </button>
            {props.features.length > 0 && 
            <div className="flex flex-col gap-2 max-h-[200px] mt-5 overflow-y-scroll p-[8px] rounded-[8px]">
                {props.features.map((value, index) => {
                    return (
                        <input 
                            type="text" 
                            className="search-bar" 
                            value={value} 
                            placeholder={"E.g. Video Thumbnail included"}
                            onChange={(e) => updateFeatureInput(index, e.target.value)} key={index}
                            maxLength={70}
                        />
                    );
                })}
            </div>}
            <div className="flex gap-3 justify-end mt-[35px]">
                {props.skip !== undefined && 
                <button className="side-btn w-[110px]" onClick={skipPackage}>
                    Skip
                </button>}
                <button className="side-btn w-[110px]" onClick={() => props.setSection(props.back)}>
                    Back
                </button>
                <button className={`btn-primary bg-main-blue hover:bg-main-blue-hover 
                text-main-white w-[110px] px-3 ${!checkInputs() ? "invalid-button" : ""}`}
                onClick={() => props.setSection(props.next)} disabled={!checkInputs()}>
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
import { Sections } from "../../enums/Sections";
import { checkIsNumeric } from "../../utils/checkIsNumeric";
import PopUpWrapper from "../../wrappers/PopUpWrapper";
import { InitialPackageState } from "./CreatePost";
import { ReducerAction } from "./CreatePost";
import { PackageTypes } from "../../enums/PackageTypes";
import { InitialState } from "./CreatePost";

interface PackageProps {
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    back: Sections,
    skip?: Sections,
    next: Sections,
    pkgState: InitialPackageState,
    state: InitialState,
    dispatch: React.Dispatch<ReducerAction>,
    packageType: PackageTypes,
    title: string
}

export const MAX_PRICE = 2500;
export const MAX_DELIVERY_DAYS = 60;

const MAX_REVISIONS = 5;
const MAX_FEATURES = 10;

function Package(props: PackageProps) {
    function updateFeatureInput(index: number, value: string): void {
        const cpy = [...props.pkgState.features];
        cpy[index] = value;
        props.dispatch({ type: props.packageType, payload: { features: cpy } });
    }

    function addNewFeature(): void {
        if (props.pkgState.features.length < MAX_FEATURES) {
            props.dispatch({ type: props.packageType, payload: { features: [...props.pkgState.features, ""] } });
        }
    }

    function updateDeliveryTime(e: React.ChangeEvent<HTMLInputElement>): void {
        const deliveryTime = e.target.value;
        if (checkIsNumeric(deliveryTime, MAX_DELIVERY_DAYS)) {
            props.dispatch({ type: props.packageType, payload: { deliveryTime: +deliveryTime } });
        }
    }

    function updateDescription(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        const description = e.target.value.trimStart();
        props.dispatch({ type: props.packageType, payload: { description: description } });
    }

    function updateRevision(e: React.ChangeEvent<HTMLInputElement>): void {
        const revision = e.target.value;
        props.dispatch({ type: props.packageType, payload: { revisions: revision } });
    }

    function updatePackageAmount(e: React.ChangeEvent<HTMLInputElement>): void {
        const packageAmount = e.target.value;
        if (checkIsNumeric(packageAmount, MAX_PRICE)) {
            props.dispatch({ type: props.packageType, payload: { amount: +packageAmount }});
        }
    }

    function checkInputs(): boolean {
        return props.pkgState.description.length > 0 && 
        props.pkgState.deliveryTime > 0 && 
        props.pkgState.amount > 0 && 
        props.pkgState.title.length > 0;
    }

    function skipPackage(): void {
        props.dispatch({ type: props.packageType, payload: {
            revisions: "1",
            features: [],
            deliveryTime: 0,
            amount: 0,
            description: "",
            title: ""
        }});

        if (props.skip !== undefined) {
            props.setSection(props.skip);
        }
    }

    function updateTitle(e: React.ChangeEvent<HTMLInputElement>): void {
        const pkgTitle = e.target.value;
        props.dispatch({ type: props.packageType, payload: { title: pkgTitle } })
    }

    return (
        <PopUpWrapper setIsOpen={props.setPostService} title={props.title}>
            <h3 className="mb-2">Title</h3>
            <input 
                type="text"
                placeholder="Enter title of package"
                className="search-bar mb-4"
                onChange={updateTitle}
                value={props.pkgState.title}
                maxLength={70}
            />
            <h3 className="mb-2">{`Package cost (£1 - £${MAX_PRICE})`}</h3>
            <div className="flex items-center search-bar mb-4">
                <p className="select-none">£</p>
                <input 
                    type="text" 
                    min={1} 
                    max={2500} 
                    value={props.pkgState.amount > 0 ? props.pkgState.amount : ""} 
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
                value={props.pkgState.deliveryTime > 0 ? props.pkgState.deliveryTime : ""} 
            />
            <h3 className="mb-2">Amount of revisions</h3>
            <ul className="items-center w-fit text-sm flex bg-hover-light-gray rounded-[8px] px-2 mb-4">
                {new Array(MAX_REVISIONS).fill(true).map((_, index) => {
                    return (
                        <RevisionListItem
                            curRevision={(index + 1).toString()} 
                            updateRevision={updateRevision} 
                            revisions={props.pkgState.revisions} 
                            key={index}
                        />
                    );
                })}
                <RevisionListItem 
                    curRevision="unlimited" 
                    updateRevision={updateRevision} 
                    revisions={props.pkgState.revisions}
                />
            </ul>
            <h3 className="mb-2">Brief description of the package</h3>
            <textarea 
                placeholder="Write about the basic package here" 
                className="w-full search-bar mb-4" 
                rows={5} 
                maxLength={250} 
                onChange={updateDescription} 
                value={props.pkgState.description} 
            />
            <h3 className="mb-1">{`Features that come with your ${props.title.toLowerCase()}`}</h3>
            <p className="text-side-text-gray mb-3">Features added:
                <span className={props.pkgState.features.length === MAX_FEATURES ? 'text-error-text' : 'text-[#36BF54]'}>
                    {` ${props.pkgState.features.length} / ${MAX_FEATURES}`}
                </span>
            </p>
            <button className="btn-primary bg-main-black hover:bg-main-black-hover 
            text-main-white w-[140px] px-3" onClick={addNewFeature}>
                Add Feature
            </button>
            <div className="flex flex-col gap-2 max-h-[200px] mt-5 overflow-y-scroll pr-[8px] rounded-[8px] overflow-visible">
                {props.pkgState.features.map((value, index) => {
                    return (
                        <input 
                            type="text" 
                            className="search-bar focus:outline-none" 
                            value={value}
                            placeholder="E.g. Video Thumbnail included"
                            onChange={(e) => updateFeatureInput(index, e.target.value)} 
                            key={index}
                            maxLength={70}
                        />
                    );
                })}
            </div>
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
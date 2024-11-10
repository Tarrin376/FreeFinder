import { IPackage } from "../../models/IPackage";
import { useState, useEffect, useContext } from "react";
import DeliveryTimeIcon from '../../assets/delivery-time.png';
import RevisionsIcon from '../../assets/revisions.png';
import FeatureIcon from '../../assets/feature.png';
import { PackageTypes } from "../../enums/PackageTypes";
import { capitalizeWord } from "../../utils/capitalizeWord";
import CreateGroup from "../../components/ChatGroup/CreateGroup";
import { FoundUsers } from "../../types/FoundUsers";
import { UserContext } from "../../providers/UserProvider";
import { AnimatePresence } from "framer-motion";
import RequestOrder from "../../components/Order/RequestOrder";
import { useWindowSize } from "../../hooks/useWindowSize";

interface PackagesProps {
    packages: IPackage[],
    seller: FoundUsers[number],
    workType: string,
    postID: string,
    hidden: boolean
}

function Packages({ packages, seller, workType, postID, hidden }: PackagesProps) {
    const userContext = useContext(UserContext);
    const [createGroupPopUp, setCreateGroupPopUp] = useState<boolean>(false);
    const [requestOrderPopUp, setRequestOrderPopUp] = useState<boolean>(false);
    const [curPkg, setCurPkg] = useState<IPackage>();
    const windowSize = useWindowSize();

    function selectPackage(nextPackage: IPackage): void {
        setCurPkg(nextPackage);
    }

    function isMostPopular(pkgType: string): boolean {
        switch (pkgType) {
            case PackageTypes.BASIC:
                return packages[0].numOrders > Math.max(packages.length > 1 ? packages[1].numOrders : 0, packages.length > 2 ? packages[2].numOrders : 0);
            case PackageTypes.STANDARD:
                return packages[1].numOrders > Math.max(packages[0].numOrders, packages.length > 2 ? packages[2].numOrders : 0);
            default:
                return packages[2].numOrders > Math.max(packages[0].numOrders, packages[1].numOrders);
        }
    }

    useEffect(() => {
        const basicPkg = packages.find((x) => x.type === PackageTypes.BASIC);
        if (basicPkg) {
            setCurPkg(basicPkg);
        }
    }, [packages]);

    return (
        <div className={`bg-main-white rounded-[12px] border border-light-border-gray 
        shadow-info-component w-full ${windowSize < 1130 ? "max-h-[605px]" : "h-[605px]"} overflow-hidden`}>
            <AnimatePresence>
                {createGroupPopUp &&
                <CreateGroup
                    setCreateGroupPopUp={setCreateGroupPopUp}
                    initialServiceID={postID}
                    seller={seller}
                />}
                {requestOrderPopUp && curPkg &&
                <RequestOrder
                    curPkg={curPkg}
                    postID={postID}
                    seller={seller}
                    workType={workType}
                    setRequestOrderPopUp={setRequestOrderPopUp}
                />}
            </AnimatePresence>
            {curPkg &&
            <>
                <div className="flex justify-evenly">
                    {packages.sort((a, b) => a.type.localeCompare(b.type)).map((cur, index) => {
                        return (
                            <button className={`h-[50px] border-b-2 ${cur.type === curPkg.type ? 
                            "border-main-blue" : "border-light-border-gray"} 
                            text-main-blue flex-grow basis-0`} 
                            onClick={() => selectPackage(cur)} 
                            key={index}>
                                {capitalizeWord(cur.type)}
                            </button>
                        );
                    })}
                </div>
                <div className="p-6 h-[calc(100%-50px)] flex flex-col justify-between">
                    <div className="flex-grow overflow-y-scroll pr-[8px]">
                        <div className="flex justify-between items-center mt-[-6px]">
                            <h3 className="text-[18px]">
                                {`${capitalizeWord(curPkg.type)} package`}
                            </h3>
                            {isMostPopular(curPkg.type) && 
                            <p className="bg-light-green w-fit text-[15px] px-3 py-[1px] rounded-[5px]">
                                Popular
                            </p>}
                        </div>
                        <div>
                            <span className={`${windowSize < 1320 ? "text-[28px]" : "text-[33px]"} mr-2`}>
                                £{curPkg.amount.toFixed(2)}
                            </span>
                            <span className="text-sm text-side-text-gray">
                                (exc. service fee)
                            </span>
                        </div>
                        <p className="text-side-text-gray mb-4 pb-4 border-b border-light-border-gray font-bold">
                            {curPkg.title}
                        </p>
                        <p className="mt-1 mb-4 pb-4 border-b border-light-border-gray">
                            {curPkg.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                            <img src={DeliveryTimeIcon} alt="" width="20px" height="20px" />
                            <p className="text-side-text-gray">
                                {`${curPkg.deliveryTime} ${curPkg.deliveryTime === 1 ? "day" : "days"} delivery`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-light-border-gray">
                            <img src={RevisionsIcon} alt="" width="20px" height="20px" />
                            <p className="text-side-text-gray">
                                {`${curPkg.revisions} ${curPkg.revisions === "1" ? "revision" : "revisions"}`}
                            </p>
                        </div>
                        <ul className="flex flex-col gap-1">
                            {curPkg.features.map((feature, index) => {
                                return (
                                    <li className="flex items-center gap-2" key={index}>
                                        <img src={FeatureIcon} width="20px" height="20px" alt="" />
                                        <p>{feature}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="flex-shrink-0">
                        <button className={`side-btn w-full !h-12 mt-6 ${userContext.userData.username === "" || hidden ? "invalid-button" : ""}`} 
                        onClick={() => setCreateGroupPopUp(true)}>
                            Message seller
                        </button>
                        <button className={`main-btn mt-3 ${userContext.userData.username === "" || hidden ? "invalid-button" : ""}`} 
                        onClick={() => setRequestOrderPopUp(true)}>
                            Request an order
                        </button>
                    </div>
                </div>
            </>}
        </div>
    );
}

export default Packages;
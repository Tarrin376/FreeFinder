import { IPackage } from "../../models/IPackage";
import { useState, useEffect, useContext } from "react";
import DeliveryTimeIcon from '../../assets/delivery-time.png';
import RevisionsIcon from '../../assets/revisions.png';
import FeatureIcon from '../../assets/feature.png';
import { PackageTypes } from "../../enums/PackageTypes";
import { capitalizeWord } from "../../utils/capitalizeWord";
import CreateGroup from "../../components/CreateGroup";
import { FoundUsers } from "../../types/FoundUsers";
import { UserContext } from "../../providers/UserContext";
import { AnimatePresence } from "framer-motion";

interface PackagesProps {
    packages: IPackage[],
    seller: FoundUsers[number],
    postID: string
}

function Packages({ packages, seller, postID }: PackagesProps) {
    const [curPkg, setCurPkg] = useState<IPackage>();
    const [createGroupPopUp, setCreateGroupPopUp] = useState<boolean>(false);
    const userContext = useContext(UserContext);
    
    useEffect(() => {
        const basicPkg = packages.find((x) => x.type === PackageTypes.BASIC);
        if (basicPkg) {
            setCurPkg(basicPkg);
        }
    }, [packages]);

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

    return (
        <div className="bg-main-white rounded-[12px] border border-light-border-gray 
        shadow-info-component w-full h-[605px] overflow-hidden">
            <AnimatePresence>
                {createGroupPopUp &&
                <CreateGroup
                    setCreateGroupPopUp={setCreateGroupPopUp}
                    initialServiceID={postID}
                    seller={seller}
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
                            <h3 className="text-[23px]">
                                {`${capitalizeWord(curPkg.type)} package`}
                            </h3>
                            {isMostPopular(curPkg.type) && 
                            <p className="bg-light-green w-fit text-[15px] px-3 py-[1px] rounded-[5px]">
                                Popular
                            </p>}
                        </div>
                        <p className="text-[35px]">
                            £{curPkg.amount}
                        </p>
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
                    {userContext.userData.username !== "" &&
                    <button className="side-btn w-full !h-12 mt-6" onClick={() => setCreateGroupPopUp(true)}>
                        Message seller
                    </button>}
                    <button className={`main-btn ${userContext.userData.username !== "" ? "mt-3" : "mt-6"}`}>
                        Request an order
                    </button>
                </div>
            </>}
        </div>
    );
}

export default Packages;
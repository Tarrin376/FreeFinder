import { IPackage } from "../../models/IPackage";
import { useState, useEffect } from "react";
import DeliveryTimeIcon from '../../assets/delivery-time.png';
import RevisionsIcon from '../../assets/revisions.png';
import FeatureIcon from '../../assets/feature.png';

function Packages({ packages }: { packages: IPackage[] }) {
    const [curPkg, setCurPkg] = useState<IPackage>();
    
    useEffect(() => {
        const basicPkg = packages.find((x) => x.type === "BASIC");
        if (basicPkg) {
            setCurPkg(basicPkg);
        }
    }, [packages]);

    function selectPackage(nextPackage: IPackage) {
        setCurPkg(nextPackage);
    }

    function capitalizePkgType(pkgType: string) {
        return `${pkgType[0]}${pkgType.substring(1).toLowerCase()}`;
    }

    function isMostPopular(pkgType: string): boolean {
        switch (pkgType) {
            case "BASIC":
                return packages[0].numOrders > Math.max(packages.length > 1 ? packages[1].numOrders : 0, packages.length > 2 ? packages[2].numOrders : 0);
            case "STANDARD":
                return packages[1].numOrders > Math.max(packages[0].numOrders, packages.length > 2 ? packages[2].numOrders : 0);
            default:
                return packages[2].numOrders > Math.max(packages[0].numOrders, packages[1].numOrders);
        }
    }

    return (
        <div className="bg-main-white relative rounded-[8px] border border-light-border-gray w-[370px] shadow-info-component">
            {curPkg &&
            <>
                <div className="flex justify-evenly overflow-hidden">
                    {packages.sort((a, b) => a.type.localeCompare(b.type)).map((cur, index) => {
                        return (
                            <button className={`h-[50px] border-b-2 ${cur.type === curPkg.type ? " border-main-blue bg-[#2375e109]" : "border-light-gray"} 
                            flex-grow basis-0`} onClick={() => selectPackage(cur)} key={index}>
                                {capitalizePkgType(cur.type)}
                            </button>
                        );
                    })}
                </div>
                <div className="p-6 overflow-y-scroll h-[calc(100%-50px)] flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mt-[-6px]">
                            <h3 className="text-[23px]">{capitalizePkgType(curPkg.type)} package</h3>
                            {isMostPopular(curPkg.type) && <p className="bg-[#fbb6fd] w-fit text-[15px] px-3 py-[1px] rounded-[5px]">Popular</p>}
                        </div>
                        <p className="text-[35px]">£{curPkg.amount}</p>
                        <p className="text-side-text-gray mb-4 pb-4 border-b border-b-light-gray">One time payment with no extra charges</p>
                        <p className="mt-1 mb-4 pb-4 border-b border-b-light-gray text-paragraph-text">{curPkg.description}</p>
                        <div className="flex items-center gap-2 mb-1">
                            <img src={DeliveryTimeIcon} alt="" width="20px" height="20px" />
                            <p className="text-side-text-gray">{curPkg.deliveryTime} days delivery</p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <img src={RevisionsIcon} alt="" width="20px" height="20px" />
                            <p className="text-side-text-gray">{curPkg.revisions} {curPkg.revisions === "1" ? "revision" : "revisions"}</p>
                        </div>
                        <ul>
                            {curPkg.features.map((feature, index) => {
                                return (
                                    <li className="flex items-center gap-2" key={index}>
                                        <img src={FeatureIcon} width="20px" height="20px" alt="" />
                                        <p className="text-paragraph-text break-all">{feature}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <button className="btn-primary w-[100%] min-h-[45px] bg-main-blue hover:bg-main-blue-hover text-main-white mt-5">
                        Request An Order
                    </button>
                </div>
            </>}
        </div>
    );
}

export default Packages;
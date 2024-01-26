import { sellerLevelTextStyles } from "../../utils/sellerLevelTextStyles";
import { allSellerLevels } from "../../utils/allSellerLevels";

interface SellerLevelsProps {
    loading: boolean,
    sellerLevels: string[],
    updateSellerLevels: (sellerLevels: string[]) => void
}

function SellerLevels({ loading, updateSellerLevels, sellerLevels }: SellerLevelsProps) {
    function update(sellerLevel: string): string[] {
        if (sellerLevels.includes(sellerLevel)) return sellerLevels.filter((level: string) => level !== sellerLevel);
        else return [...sellerLevels, sellerLevel];
    }

    return (
        <div className="border-b border-light-border-gray pb-5 mt-5">
            <h3 className="text-side-text-gray mb-2 text-[16px]">Seller level</h3>
            <div className="flex flex-col gap-3">
                {allSellerLevels.map((sellerLevel: string, index: number) => {
                    return (
                        <div className="flex items-center gap-3" key={index}>
                            <input 
                                type="checkbox" 
                                name="seller-level" 
                                className={`w-[15px] h-[15px] mt-[1px] ${loading ? "invalid-button" : ""}`} 
                                id={sellerLevel}
                                defaultChecked={sellerLevels.includes(sellerLevel)}
                                onClick={() => updateSellerLevels(update(sellerLevel))}
                            />
                            <label htmlFor={sellerLevel} className="text-[15px] seller-level" style={sellerLevelTextStyles[sellerLevel]}>
                                {sellerLevel}
                            </label>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SellerLevels;
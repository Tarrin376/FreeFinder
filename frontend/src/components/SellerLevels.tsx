import { sellerLevelTextStyles } from "../utils/sellerLevelTextStyles";
import { allSellerLevels } from "../utils/allSellerLevels";

interface SellerLevelsProps {
    loading: boolean,
    sellerLevels: string[],
    setSellerLevels: React.Dispatch<React.SetStateAction<string[]>>
}

function SellerLevels({ loading, setSellerLevels, sellerLevels }: SellerLevelsProps) {
    function updateSellerLevels(sellerLevel: string): void {
        setSellerLevels((cur) => {
            if (cur.includes(sellerLevel)) return cur.filter((level: string) => level !== sellerLevel);
            else return [...cur, sellerLevel];
        });
    }

    return (
        <div className="border-b border-light-border-gray pb-6 mt-4">
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
                                onClick={() => updateSellerLevels(sellerLevel)}
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
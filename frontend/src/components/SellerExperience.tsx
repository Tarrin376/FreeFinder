import { sellerLevelTextStyles } from "../utils/sellerLevelTextStyles"

interface SellerExperienceProps {
    level: string,
    nextLevel: string,
    sellerXP: number,
    nextLevelXP: number
}

function SellerExperience({ level, nextLevel, nextLevelXP, sellerXP }: SellerExperienceProps) {
    return (
        <div className="mb-7">
            <div className="flex items-center justify-between w-full mb-3">
                <p className="text-sm seller-level" style={sellerLevelTextStyles[level]}>
                    {level}
                </p>
                {nextLevel !== level &&
                <p className="text-sm seller-level" style={sellerLevelTextStyles[nextLevel]}>
                    {nextLevel}
                </p>}
            </div>
            <div className="rounded-full w-full bg-very-light-gray h-[16px] overflow-hidden">
                <div className="bg-gradient-to-r from-main-blue to-light-green h-full rounded-full flex 
                items-center justify-center" style={{ width: `calc(100% / ${nextLevelXP} * ${sellerXP})`}}>
                </div>
            </div>
            <div className="flex items-center justify-between mt-3">
                <p className="bg-highlight text-main-blue w-fit text-sm px-3 py-[1px] rounded-[6px]">
                    {`${sellerXP} xp`}
                </p>
                {nextLevel !== level &&
                <p className="bg-highlight text-main-blue w-fit text-sm px-3 py-[1px] rounded-[6px]">
                    {`${nextLevelXP} xp`}
                </p>}
            </div>
        </div>
    )
}

export default SellerExperience;
import SellerExperience from "./SellerExperience";
import AddIcon from "../assets/add.png";
import { useContext } from "react";
import { UserContext } from "src/providers/UserProvider";
import { FilterPostsProviderState } from "src/providers/FilterPostsProvider";
import Filters from "./Filters";

interface PostsSidebarProps {
    loading: boolean,
    openPostService: () => void,
    deliveryTime: React.MutableRefObject<number>,
    searchHandler: () => void,
    dispatch: React.Dispatch<Partial<FilterPostsProviderState>>,
    state: FilterPostsProviderState
}

function PostsSidebar({ loading, openPostService, deliveryTime, searchHandler, dispatch, state }: PostsSidebarProps) {
    const userContext = useContext(UserContext);
    const nextLevelXP = userContext.userData.seller?.sellerLevel.nextLevel?.xpRequired ?? userContext.userData.seller?.sellerXP ?? 0;
    const nextLevel = userContext.userData.seller?.sellerLevel.nextLevel?.name ?? "";

    return (
        <div className="h-[calc(100vh-90px)] w-[360px] bg-main-white border-r border-light-border-gray p-[22.5px]">
            <button onClick={openPostService} className={`main-btn flex items-center justify-center gap-[10px] mb-[50px] 
            ${userContext.userData.username === "" ? "invalid-button" : ""}`}>
                <img src={AddIcon} alt="" className="w-[16px] h-[16px]" />
                Create new post
            </button>
            {userContext.userData.seller &&
            <>
                <h2 className="text-[20px] mb-[22px]">Your experience</h2>
                <SellerExperience
                    level={userContext.userData.seller.sellerLevel.name}
                    nextLevel={nextLevel}
                    sellerXP={userContext.userData.seller.sellerXP}
                    nextLevelXP={nextLevelXP}
                />
            </>}
            <h2 className="text-[20px] mb-[22px]">Filters</h2>
            <div className="overflow-y-scroll pr-[8px]" 
            style={{ maxHeight: userContext.userData.seller ? "calc(100vh - 483px)" : "calc(100% - 175px)" }}>
                <Filters 
                    loading={loading}
                    deliveryTime={deliveryTime}
                    searchHandler={searchHandler}
                    dispatch={dispatch}
                    state={state}
                />
            </div>
        </div>
    )
}

export default PostsSidebar;
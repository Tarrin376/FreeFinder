import SellerExperience from "../Seller/SellerExperience";
import AddIcon from "../../assets/add.png";
import { useContext } from "react";
import { UserContext } from "src/providers/UserProvider";
import { FilterPostsProviderState } from "src/providers/FilterPostsProvider";
import Filters from "../Filters/Filters";

interface PostsSidebarProps {
    loading: boolean,
    updatePostServicePopUp: (val: boolean) => void,
    dispatch: React.Dispatch<Partial<FilterPostsProviderState>>,
    state: FilterPostsProviderState,
    clearFilters: () => void
}

function PostsSidebar({ loading, updatePostServicePopUp, dispatch, state, clearFilters }: PostsSidebarProps) {
    const userContext = useContext(UserContext);
    const nextLevelXP = userContext.userData.seller?.sellerLevel.nextLevel?.xpRequired ?? userContext.userData.seller?.sellerXP ?? 0;
    const nextLevel = userContext.userData.seller?.sellerLevel.nextLevel?.name ?? "";

    return (
        <div className="h-[calc(100vh-90px)] w-[360px] bg-main-white border-r border-light-border-gray p-[22.5px]">
            <button onClick={() => updatePostServicePopUp(true)} className={`main-btn flex items-center justify-center gap-[10px] mb-[50px] 
            ${userContext.userData.username === "" ? "invalid-button" : ""}`}>
                <img src={AddIcon} alt="" className="w-[16px] h-[16px]" />
                Create new post
            </button>
            {userContext.userData.seller &&
            <SellerExperience
                level={userContext.userData.seller.sellerLevel.name}
                nextLevel={nextLevel}
                sellerXP={userContext.userData.seller.sellerXP}
                nextLevelXP={nextLevelXP}
                text="Seller experience"
                styles="mb-7"
            />}
            <h2 className="text-[18px] mb-[22px]">
                Filters
                <span className="text-[15px] underline text-main-blue ml-2 cursor-pointer" 
                onClick={clearFilters}>
                    Clear all
                </span>
            </h2>
            <div className="overflow-y-scroll pr-[8px]" style={{ maxHeight: userContext.userData.seller ? 
            "calc(100vh - 483px)" : "calc(100% - 175px)" }}>
                <Filters 
                    loading={loading}
                    dispatch={dispatch}
                    state={state}
                />
            </div>
        </div>
    )
}

export default PostsSidebar;
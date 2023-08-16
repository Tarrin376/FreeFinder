import Packages from "./Packages";
import CreateReview from "src/components/CreateReview";
import { PostViewState } from "./PostView";
import { scrollIntoView } from "src/utils/scrollIntoView";
import { useWindowSize } from "src/hooks/useWindowSize";

interface ReviewsAndPackagesProps {
    state: PostViewState,
    reviewsRef: React.RefObject<HTMLDivElement>,
    styles?: string
}

function ReviewsAndPackages({ state, reviewsRef, styles }: ReviewsAndPackagesProps) {
    const windowSize = useWindowSize();
    const defaultStyles = `relative flex-shrink-0 ${windowSize >= 784 && windowSize < 1130 ? "flex gap-7" : ""}`;

    return (
        <div className={`${defaultStyles} ${styles}`}>
            <div className={windowSize >= 784 && windowSize < 1130 ? "flex-shrink-0 w-[340px]" : ""}>
                <Packages 
                    packages={state.postData!.packages}
                    postID={state.postData!.postID}
                    workType={state.postData!.workType.name}
                    hidden={state.postData!.hidden}
                    seller={{
                        username: state.postData!.postedBy.user.username,
                        status: state.postData!.postedBy.user.status,
                        profilePicURL: state.postData!.postedBy.user.profilePicURL,
                        userID: state.postData!.postedBy.user.userID
                    }}
                />
                <button className="btn-primary text-main-white bg-main-black hover:bg-main-black-hover 
                w-full !h-[48px] mt-[26px] shadow-info-component" 
                onClick={() => scrollIntoView(reviewsRef)}>
                    See seller reviews
                </button>
            </div>
            <CreateReview 
                postID={state.postData!.postID} 
                sellerID={state.postData!.sellerID}
                hidden={state.postData!.hidden}
            />
        </div>
    )
}

export default ReviewsAndPackages;
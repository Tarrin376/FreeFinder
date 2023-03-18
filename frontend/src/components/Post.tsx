import SaveIcon from '../assets/save-instagram.png';
import StarIcon from '../assets/star.png';

interface PostProps {
    createdAt: Date,
    startingPrice: string,
    title: string,
    sellerName: string,
    profilePicURL: string,
    sellerRating: number,
    userID: string,
    postID: string
}

function Post({ createdAt, startingPrice, title, sellerName, profilePicURL, sellerRating, userID, postID }: PostProps) {
    function getTimePosted(): string {
        const seconds: number = Math.floor((new Date().getTime() - createdAt.getTime()) / 1000);

        if (seconds < 60) {
            return `Posted ${seconds} ${seconds !== 1 ? 'seconds' : 'second'} ago`;
        } else if (seconds < 60 * 60) {
            const minutes = Math.floor(seconds / 60);
            return `Posted ${minutes} ${minutes !== 1 ? 'minutes' : 'minute'} ago`;
        } else if (seconds < 60 * 60 * 24) {
            const hours = Math.floor(seconds / 60 / 60);
            return `Posted ${hours} ${hours !== 1 ? 'hours' : 'hour'} ago`;
        } else {
            const days = Math.floor(seconds / 60 / 60 / 24);
            return `Posted ${days} ${days !== 1 ? 'days' : 'day'} ago`;
        }
    }

    async function savePost(): Promise<void> {
        try {
            const response = await fetch('/post/savePost', {
                method: 'POST',
                body: JSON.stringify({
                    userID: userID,
                    postID: postID
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                return res.json();
            });

            if (response.message === "success") {
                console.log("success");
            } else {
                console.log(response.message);
            }
        }
        catch (err) {

        }
    }

    return (
        <div className="bg-main-white w-[290px] rounded-[8px] border border-light-gray shadow-post overflow-hidden">
            <div className="w-full h-[200px] bg-black"></div>
            <div className="p-4">
                <div className="flex items-center mt-1 mb-2 gap-3">
                    <img className="w-12 h-12 bg-black rounded-full" src={profilePicURL} alt="profile" />
                    <div>
                        <p className="font-semibold">
                            {sellerName} 
                            <span className="btn-primary action-btn rounded-[12px] px-[9px] text-[14px] ml-[10px] select-none hover:!bg-main-purple">
                                New
                            </span>
                        </p>
                        <div className="flex items-center gap-[7px]">
                            <img src={StarIcon} className="w-[17px] h-[17px]" alt="star" />
                            <p className="text-[15px] text-rating-text font-bold">{sellerRating}</p>
                            <p className="text-side-text-gray text-[15px]">(1.2k+)</p>
                        </div>
                    </div>
                </div>
                <p className="text-side-text-gray text-[15px] mb-1">{getTimePosted()}</p>
                <h3 className="text-[18px] font-semibold nav-item pb-3 border-b border-b-light-gray leading-6 h-[60px] break-words">{title}</h3>
                <div className="mt-4 flex items-center justify-between">
                    <p className="py-[2px] px-3 border border-nav-search-gray rounded-[17px] w-fit">Starting at: £{startingPrice}</p>
                    <img src={SaveIcon} className="w-[25px] h-[25px] cursor-pointer" alt="save" onClick={savePost} />
                </div>
            </div>
        </div>
    );
}

export default Post;
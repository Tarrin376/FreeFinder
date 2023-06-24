import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import { PostPage } from "../../types/PostPage";
import LocationIcon from '../../assets/location-sign-svgrepo-com(2).svg';
import UserIcon from '../../assets/user-icon-svgrepo-com.svg';

function AboutSeller({ postData }: { postData: PostPage }) {
    return (
        <section className="bg-main-white rounded-[8px] shadow-info-component p-4 pt-3 w-1/4 h-[calc(100vh-210px)] flex flex-col overflow-y-scroll">
            <div className="flex-grow">
                <div className="border-b border-b-light-gray pb-4 relative">
                    <h3 className="text-xl mb-4">About this seller</h3>
                    <ProfilePicAndStatus 
                        profilePicURL={postData.postedBy.user.profilePicURL} 
                        profileStatus={postData.postedBy.user.status}
                        statusStyles='before:hidden'
                        imgStyles="m-auto w-[100px] h-[100px]"
                    />
                    <h4 className="text-lg text-center mt-2">
                        <span className="text-main-blue">@</span>
                        {postData.postedBy.user.username}
                    </h4>
                </div>
                {postData.postedBy.description !== "" &&
                <div className="border-b border-b-light-gray pb-4 pt-4">
                    <h4 className="text-[18px] mb-2">Description</h4>
                    <p className="text-paragraph-text break-all">
                        {postData.postedBy.description}
                    </p>
                </div>}
                <div className="pb-4 pt-4">
                    <div className="flex gap-1 items-center">
                        <img src={LocationIcon} width="20px" height="20px" alt="location" />
                        <p className="text-side-text-gray">From</p>
                        <p className="ml-auto text-side-text-gray">{postData.postedBy.user.country}</p>
                    </div>
                    <div className="flex gap-1 items-center mt-2">
                        <img src={UserIcon} width="20px" height="20px" alt="location" />
                        <p className="text-side-text-gray">Member since</p>
                        <p className="ml-auto text-side-text-gray">{new Date(postData.postedBy.user.memberDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            <div>
                <button className="btn-primary w-[100%] h-[45px] bg-main-blue hover:bg-main-blue-hover text-main-white mb-4 mt-1">
                    Contact Seller
                </button>
                <button className="btn-primary w-[100%] h-[45px] bg-very-light-gray hover:bg-very-light-gray-hover">
                    {`Reviews (${postData.postedBy.numReviews})`}
                </button>
            </div>
        </section>
    );
}

export default AboutSeller;
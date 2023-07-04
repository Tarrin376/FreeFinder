import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import { PostPage } from "../../types/PostPage";
import LocationIcon from '../../assets/location-sign-svgrepo-com(2).svg';
import UserIcon from '../../assets/user-icon-svgrepo-com.svg';
import StarGrayIcon from "../../assets/star-gray.png";
import Options from "../../components/Options";
import { sellerLevelTextStyles } from "../../utils/sellerLevelTextStyles";

function AboutSeller({ postData }: { postData: PostPage }) {
    return (
        <section className="bg-main-white border border-light-border-gray shadow-info-component 
        rounded-[12px] p-6 h-fit w-full">
            <div className="mb-4 flex gap-5">
                <ProfilePicAndStatus 
                    profilePicURL={postData.postedBy.user.profilePicURL} 
                    profileStatus={postData.postedBy.user.status}
                    statusStyles='before:hidden'
                    imgStyles="w-[75px] h-[75px]"
                />
                <div className="flex-grow flex justify-between">
                    <div>
                        <p>
                            {postData.postedBy.user.username}
                        </p>
                        <p className="text-[15px] mt-1 mb-1" style={sellerLevelTextStyles[postData.postedBy.sellerLevel.name]}>
                            {postData.postedBy.sellerLevel.name}
                        </p>
                        <p className="text-side-text-gray text-[15px]">
                            {postData.postedBy.user.country}
                        </p>
                    </div>
                    <svg
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="block fill-[#00000086] h-[24px] w-[24px] stroke-white stroke-2 cursor-pointer" 
                        aria-hidden="true" 
                        role="presentation" 
                        focusable="false">
                        <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                        </path>
                    </svg>
                </div>
            </div>
            {postData.postedBy.description !== "" &&
            <p className="text-paragraph-text break-all">
                {postData.postedBy.description}
            </p>}
            <div className="flex gap-2 items-center mt-4">
                <img src={LocationIcon} width="20px" height="20px" alt="location" />
                <p className="text-side-text-gray">Lives in</p>
                <p className="ml-auto">{postData.postedBy.user.country}</p>
            </div>
            <div className="flex gap-2 items-center mt-2">
                <img src={UserIcon} width="20px" height="20px" alt="location" />
                <p className="text-side-text-gray">Member since</p>
                <p className="ml-auto">{new Date(postData.postedBy.user.memberDate).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 items-center mt-2 mb-3">
                <img src={StarGrayIcon} width="20px" height="20px" alt="location" />
                <p className="text-side-text-gray">Seller rating</p>
                <p className="ml-auto">{postData.postedBy.rating}</p>
            </div>
            <p>Seller speaks</p>
            <Options 
                options={postData.postedBy.languages} 
                styles="mt-2 mb-6" 
            />
            <div className="w-full flex items-center justify-between mt-4">
                <button className="side-btn">Save seller</button>
                <button className="red-btn">Report seller</button>
            </div>
        </section>
    );
}

export default AboutSeller;
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import { IPost } from "../../models/IPost";
import LocationIcon from '../../assets/location-sign-svgrepo-com(2).svg';
import UserIcon from '../../assets/user-icon-svgrepo-com.svg';

function AboutSeller({ postData }: { postData: IPost }) {
    return (
        <section className=" bg-main-white rounded-[8px] border border-gray-300 shadow-profile-page-container p-4">
            <div className="border-b border-b-light-gray pb-4 relative">
                <h3 className="text-xl mb-4">About this seller</h3>
                <ProfilePicAndStatus 
                    profilePicURL={postData.postedBy.user.profilePicURL} 
                    profileStatus={postData.postedBy.user.status}
                    statusStyles='before:hidden'
                    imgStyles="m-auto w-[100px] h-[100px]"
                />
                <h4 className="text-lg text-center mt-2 font-semibold">{postData.postedBy.user.username}</h4>
            </div>
            <div className="border-b border-b-light-gray pb-4 pt-4">
                <h3 className="text-xl mb-2">Description</h3>
                <p className="text-paragraph-text">
                    {postData.postedBy.description}
                    f msfdkmg dk hmdfkmg dgkmfdg mdfkm gdfmg dfkg mdfkg mdfg kmdfg kdmfg kdfmg kdfmg dfkmg dfkgm dfkg mdfk gmdfkg mfdk gfdkg kfdg kmdfkg dfkmg kdmf gkmdfk mgdf mkg
                </p>
            </div>
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
            <button className="btn-primary w-[100%] h-[45px] bg-main-purple hover:bg-main-purple-hover text-main-white mb-3 mt-1">
                Contact
            </button>
            <button className="btn-primary w-[100%] h-[45px] bg-very-light-gray text-main-black hover:bg-very-light-gray-hover">
                {`Reviews (${postData.postedBy.numReviews})`}
            </button>
        </section>
    );
}

export default AboutSeller;
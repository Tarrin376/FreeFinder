import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { IPost } from "../../models/IPost";
import ProfilePicAndStatus from "../../components/ProfilePicAndStatus";
import StarIcon from '../../assets/star.png';
import { getTimePosted } from "../../utils/getTimePosted";
import AboutSeller from "./AboutSeller";
import VisitorsAlsoViewed from "./VisitorsAlsoViewed";
import Review from "./Reviews";

function PostPage() {
    const location = useLocation();
    const [postData, setPostData] = useState<IPost>();
    
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`/post/getPost/${location.search}`);
                if (response.status !== 500) {
                    const data = await response.json();
                    setPostData(data.post);
                }
            }
            catch (err: any) {
                console.log(err.message);
            }
        })();
    }, [location.search]);

    if (!postData) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="page flex gap-[60px]">
            <div className="w-[75%]">
                <header>
                    <p className="text-main-purple mb-2">Website design</p>
                    <h1 className="text-3xl mb-4">{postData.title}</h1>
                    <div className="flex gap-3">
                        <div className="relative">
                            <ProfilePicAndStatus 
                                profilePicURL={postData.postedBy.user.profilePicURL} 
                                profileStatus={postData.postedBy.user.status}
                                statusStyles='before:left-[30px] cursor-pointer'
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-[7px]">
                                <p className="font-semibold nav-item">{postData.postedBy.user.username}</p>
                                <img src={StarIcon} className="w-[17px] h-[17px]" alt="star" />
                                <p className="text-[15px] text-rating-text font-bold">{postData.postedBy.rating}</p>
                            </div>
                            <p className="text-side-text-gray text-[15px]">{getTimePosted(postData.createdAt)}</p>
                        </div>
                    </div>
                    <div className="flex w-[100%] h-[480px] gap-4 mt-8">
                        <img src={"#"} className="w-[800px] block rounded-[8px]" />
                        <div className="flex-1 bg-main-white rounded-[8px] border border-gray-300 shadow-profile-page-container"></div>
                    </div>
                </header>
                <div className="flex justify-between mt-8 items-center">
                    <h2 className="text-2xl">{`${postData.postedBy.user.username}'s most popular reviews`}</h2>
                    <p className="text-main-purple underline nav-item hover:text-main-black">See all reviews</p>
                </div>
                <div className="bg-main-white rounded-[8px] border border-gray-300 mt-4 shadow-profile-page-container flex">
                    <Review styles="border-r border-r-light-gray" />
                    <Review />
                </div>
                <section className="mt-8">
                    <h2 className="text-2xl mb-3">About this service</h2>
                    <p className="text-paragraph-text">{postData.about}</p>
                </section>
            </div>
            <div className="w-[25%]">
                <AboutSeller postData={postData} />
                <VisitorsAlsoViewed />
            </div>
        </div>
    );
}

export default PostPage;
import { IOrder } from "src/models/IOrder";
import ProfilePicAndStatus from "../Profile/ProfilePicAndStatus";
import UserStatusText from "../Profile/UserStatus";
import KeyPair from "../common/KeyPair";
import { useCountdown } from "src/hooks/useCountdown";
import DropdownIconElement from "../Dropdown/DropdownIcon";
import { useState } from "react";
import { capitalizeWord } from "src/utils/capitalizeWord";
import CompleteOrderPopUp from "./CompleteOrderPopUp";
import { AnimatePresence } from "framer-motion";
import CancelOrderPopUp from "./CancelOrderPopUp";
import { useNavigate } from "react-router-dom";
import ReportSeller from "../Seller/ReportSeller";

interface OrderProps {
    order: IOrder,
    isClientOrder: boolean
}

function Order({ order, isClientOrder }: OrderProps) {
    const [dropdown, setDropdown] = useState<boolean>(false);
    const [completeOrderPopUp, setCompleteOrderPopUp] = useState<boolean>(false);
    const [cancelOrderPopUp, setCancelOrderPopUp] = useState<boolean>(false);
    const [reportSellerPopUp, setReportSellerPopUp] = useState<boolean>(false);
    const [remove, setRemove] = useState<boolean>(false);

    const timeRemaining = useCountdown(new Date(order.deliveryEndDate));
    const navigate = useNavigate();

    function toggleDropdown(): void {
        setDropdown((cur) => !cur);
    }

    function openCompleteOrderPopUp(): void {
        setCompleteOrderPopUp(true);
    }

    function openCancelOrderPopUp(): void {
        setCancelOrderPopUp(true);
    }

    function openReportSellerPopUp(): void {
        setReportSellerPopUp(true);
    }

    function navigateToProfile(): void {
        navigate(`/sellers/${order.user.seller.sellerID}`);
    }

    return (
        <>
            <AnimatePresence>
                {completeOrderPopUp && 
                <CompleteOrderPopUp 
                    setCompleteOrderPopUp={setCompleteOrderPopUp}
                    postID={order.package.post.postID}
                    packageType={order.package.type}
                    revisions={order.package.revisions}
                    workType={order.package.post.workType.name}
                    orderID={order.orderID}
                    seller={{
                        profilePicURL: order.user.profilePicURL,
                        username: order.user.username,
                        status: order.user.status
                    }}
                />}
                {cancelOrderPopUp &&
                <CancelOrderPopUp 
                    setCancelOrderPopUp={setCancelOrderPopUp}
                    setRemove={setRemove}
                    postID={order.package.post.postID}
                    packageType={order.package.type}
                    revisions={order.package.revisions}
                    workType={order.package.post.workType.name}
                    orderID={order.orderID}
                    seller={{
                        profilePicURL: order.user.profilePicURL,
                        username: order.user.username,
                        status: order.user.status
                    }}
                />}
                {reportSellerPopUp &&
                <ReportSeller
                    setReportSellerPopUp={setReportSellerPopUp}
                    username={order.user.username}
                    sellerID={order.user.seller.sellerID}
                />}
            </AnimatePresence>
            {!remove && <div className="border border-light-border-gray bg-main-white w-full shadow-info-component rounded-[12px]">
                <div className={`${dropdown ? "border-b border-light-border-gray" : ""} relative`}>
                    <div className="w-full bg-hover-light-gray py-[2px] flex items-center justify-center gap-3 
                    border-b border-light-border-gray rounded-t-[12px]">
                        <p className="text-main-black">
                            {timeRemaining}
                        </p>
                    </div>
                    <div className="w-full flex gap-5">
                        <div className="flex items-center gap-4 p-5 border-r border-light-gray min-w-[300px]">
                            <ProfilePicAndStatus
                                profilePicURL={order.user.profilePicURL}
                                size={55}
                                action={navigateToProfile}
                                username={order.user.username}
                                statusRight={true}
                            />
                            <div>
                                <p className="text-lg link" onClick={navigateToProfile}>
                                    {order.user.username}
                                </p>
                                <UserStatusText
                                    profileStatus={order.user.status} 
                                    username={order.user.username}
                                />
                            </div>
                        </div>
                        <div className="flex flex-grow p-5 justify-between items-center">
                            <div className="flex flex-col gap-1">
                                <KeyPair 
                                    itemKey="Order ID" 
                                    itemValue={order.orderID} 
                                    textSize={16} 
                                    styles="text-side-text-gray"
                                />
                                <KeyPair 
                                    itemKey={isClientOrder ? "Client location" : "Seller location"} 
                                    itemValue={order.user.country} 
                                    textSize={16} 
                                    styles="text-side-text-gray" 
                                />
                                <KeyPair 
                                    itemKey={isClientOrder ? "Client email address" : "Seller email address"}
                                    itemValue={order.user.email} 
                                    textSize={16} 
                                    styles="text-side-text-gray" 
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                {isClientOrder && 
                                <button className="btn-primary bg-main-blue text-main-white 
                                hover:bg-main-blue-hover" onClick={openCompleteOrderPopUp}>
                                    Finish order
                                </button>}
                                <button className="btn-primary red-btn" 
                                onClick={() => isClientOrder ? openCancelOrderPopUp() : openReportSellerPopUp()}>
                                    {isClientOrder ? "Cancel order" : "Report seller"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <DropdownIconElement
                        size={30}
                        dropdown={dropdown}
                        action={toggleDropdown}
                        styles="absolute bottom-[-15px] left-[50%] translate-x-[-50%] 
                        bg-main-white rounded-full border border-light-border-gray p-[5px]"
                    />
                </div>
                {dropdown &&
                <div className="w-full p-5 pt-3 flex justify-between">
                    <div>
                        <h3>Service:</h3>
                        <div className="pt-2 pl-4 flex flex-col gap-1">
                            <KeyPair 
                                itemKey="Service ID" 
                                itemValue={order.package.post.postID} 
                                textSize={16} 
                                styles="text-side-text-gray"
                            />
                            <KeyPair 
                                itemKey="Service name"
                                itemValue={order.package.post.title} 
                                textSize={16} 
                                styles="text-side-text-gray" 
                            />
                            <KeyPair 
                                itemKey="Package type"
                                itemValue={capitalizeWord(order.package.type)} 
                                textSize={16} 
                                styles="text-side-text-gray" 
                            />
                        </div>
                    </div>
                    <div>
                    <h3>Order details:</h3>
                        <div className="pt-2 pl-4 flex flex-col gap-1">
                            <KeyPair 
                                itemKey="Status" 
                                itemValue={capitalizeWord(order.status)} 
                                textSize={16} 
                                styles="text-side-text-gray"
                            />
                            <KeyPair 
                                itemKey="Delivery date"
                                itemValue={new Date(order.deliveryEndDate).toDateString()} 
                                textSize={16} 
                                styles="text-side-text-gray" 
                            />
                            <KeyPair 
                                itemKey="Order created"
                                itemValue={new Date(order.createdAt).toDateString()} 
                                textSize={16} 
                                styles="text-side-text-gray" 
                            />
                        </div>
                    </div>
                </div>}
            </div>}
        </>
    )
}

export default Order;
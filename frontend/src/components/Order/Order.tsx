import { IOrder } from "src/models/IOrder";
import ProfilePicAndStatus from "../Profile/ProfilePicAndStatus";
import UserStatusText from "../Profile/UserStatus";
import KeyPair from "../KeyPair";
import { useCountdown } from "src/hooks/useCountdown";
import DropdownIconElement from "../Dropdown/DropdownIcon";
import { useState } from "react";
import { capitalizeWord } from "src/utils/capitalizeWord";

interface OrderProps {
    order: IOrder,
    isClientOrder: boolean
}

function Order({ order, isClientOrder }: OrderProps) {
    const timeRemaining = useCountdown(new Date(order.deliveryEndDate));
    const [dropdown, setDropdown] = useState<boolean>(false);

    function toggleDropdown(): void {
        setDropdown((cur) => !cur);
    }

    return (
        <div className="border border-light-border-gray bg-main-white w-full shadow-info-component rounded-[12px]">
            <div className={`${dropdown ? "border-b border-light-border-gray" : ""} relative`}>
                <div className="w-full bg-hover-light-gray py-[2px] flex items-center justify-center gap-3 
                border-b border-light-border-gray rounded-t-[12px]">
                    <p className="text-main-black">{timeRemaining}</p>
                    <button className="text-main-blue bg-transparent underline">Request extension</button>
                </div>
                <div className="w-full flex gap-5">
                    <div className="flex items-center gap-4 p-5 border-r border-light-gray min-w-[300px]">
                        <ProfilePicAndStatus
                            profilePicURL={order.user.profilePicURL}
                            size={55}
                            username={order.user.username}
                            statusRight={true}
                        />
                        <div>
                            <p className="text-lg">{order.user.username}</p>
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
                            <button className="btn-primary bg-main-blue text-main-white">
                                {isClientOrder ? "Complete order" : "Contact seller"}
                            </button>
                            <button className="btn-primary bg-[#B00020] text-main-white">
                                {isClientOrder ? "Cancel order" : "Request order cancel"}
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
                    <h3 className="text-lg">Service:</h3>
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
                <h3 className="text-lg">Order details:</h3>
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
        </div>
    )
}

export default Order;
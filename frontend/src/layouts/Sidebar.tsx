import { motion } from "framer-motion";
import { useContext } from "react";
import { UserContext } from "../providers/UserProvider";
import AccountOptions from "../components/AccountOptions";
import SearchSellers from "../components/SearchSellers";
import { useNavigate } from "react-router-dom";
import CloseSvg from "../components/CloseSvg";
import SidebarDropdown from "src/components/SidebarDropdown";
import SidebarDropdownElement from "src/components/SidebarDropdownElement";

interface SidebarProps {
    setLogIn: React.Dispatch<React.SetStateAction<boolean>>,
    setSignUp: React.Dispatch<React.SetStateAction<boolean>>,
    setSavedSellersPopUp: React.Dispatch<React.SetStateAction<boolean>>,
    toggleSidebar: () => void,
    logout: () => Promise<void>,
    windowSize: number
}

function Sidebar(props: SidebarProps) {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    function navigateToPage(url: string): void {
        props.toggleSidebar();
        navigate(url);
    }

    return (
        <motion.div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-main-white flex flex-col gap-4 z-50"
        initial={{ x: `-100%` }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.2 }}>
            <div className="w-full h-full relative p-4">
                <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                        <CloseSvg
                            size={27}
                            colour="#9c9c9c"
                            action={props.toggleSidebar}
                        />
                        <h1 className="text-main-blue text-[20px]">
                            FreeFinder
                        </h1>
                    </div>
                    <SearchSellers 
                        styles="w-full mb-4"
                        toggleSidebar={props.toggleSidebar}
                    />
                    <ul className="list-none overflow-y-scroll h-[calc(100vh-206px)] pr-[8px]">
                        {props.windowSize < 865 && 
                        <>
                            <li className="sidebar-item" onClick={() => navigateToPage('posts/all')}>
                                Browse all
                            </li>
                            {userContext.userData.seller &&
                            <>
                                <li className="sidebar-item">
                                    Client orders
                                </li>
                            </>}
                        </>}
                        {userContext.userData.userID !== "" && props.windowSize < 1200 &&
                        <>
                            <li>
                                <SidebarDropdown title="Orders">
                                    <SidebarDropdownElement
                                        text="My orders"
                                        action={() => navigate(`/${userContext.userData.username}/saved/posts`)}
                                    />
                                    <SidebarDropdownElement
                                        text="Order requests"
                                        action={() => props.setSavedSellersPopUp(true)}
                                    />
                                </SidebarDropdown>
                            </li>
                            <li>
                                <SidebarDropdown title="Saved" styles="!pt-0">
                                    <SidebarDropdownElement
                                        text="services"
                                        action={() => navigateToPage(`/${userContext.userData.username}/saved/posts`)}
                                    />
                                    <SidebarDropdownElement
                                        text="sellers"
                                        action={() => {
                                            props.toggleSidebar();
                                            props.setSavedSellersPopUp(true);
                                        }}
                                    />
                                </SidebarDropdown>
                            </li>
                            <li className="sidebar-item !pt-0"
                            onClick={() => navigateToPage(`${userContext.userData.username}/posts`)}>
                                My services
                            </li>
                        </>}
                    </ul>
                </div>
                {props.windowSize <= 523 &&
                <div className="shadow-post fixed bottom-0 left-0 p-5 w-full bg-main-white">
                    {userContext.userData.username === "" &&
                    <AccountOptions 
                        setLogIn={props.setLogIn} 
                        setSignUp={props.setSignUp}
                        action={() => props.toggleSidebar()}
                        styles="justify-center flex-col items-stretch"
                    />}
                    {userContext.userData.username !== "" &&
                    <button className="btn-primary w-full bg-main-black text-main-white hover:bg-main-black-hover 
                    flex-grow" onClick={props.logout}>
                        Logout
                    </button>}
                </div>}
            </div>
        </motion.div>
    )
}

export default Sidebar;
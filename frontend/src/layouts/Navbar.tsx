import { useState, useContext, useRef } from 'react';
import SignUp from '../views/SignUp/SignUp';
import LogIn from '../views/LogIn/LogIn';
import AccountCreated from '../components/Account/AccountCreated';
import { IUserContext, UserContext } from '../providers/UserProvider';
import { Outlet } from 'react-router-dom';
import ProfileMenu from '../components/Profile/ProfileMenu';
import { useNavigate } from 'react-router-dom';
import SearchSellers from '../components/Seller/SearchSellers';
import { useToggleAwayStatus } from '../hooks/useToggleAwayStatus';
import Sellers from '../components/Seller/Sellers';
import { AnimatePresence } from "framer-motion";
import { SellerOptions } from '../enums/SellerOptions';
import { useWindowSize } from '../hooks/useWindowSize';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from './Sidebar';
import AccountOptions from '../components/Account/AccountOptions';
import { INITIAL_STATE } from '../providers/UserProvider';
import axios from "axios";
import OnlineStatus from '../components/OnlineStatus';
import NavDropdown from '../components/Dropdown/NavDropdown';
import { NavElement } from '../types/NavElement';
import { UserStatus } from 'src/enums/UserStatus';
import DropdownElement from 'src/components/Dropdown/DropdownElement';

function Navbar() {
    const [signUp, setSignUp] = useState<boolean>(false);
    const [logIn, setLogIn] = useState<boolean>(false);
    const [accountCreated, setAccountCreated] = useState<boolean>(false);
    const userContext = useContext<IUserContext>(UserContext);
    const [savedSellersPopUp, setSavedSellersPopUp] = useState<boolean>(false);
    const [sidebar, setSidebar] = useState<boolean>(false);
    const windowSize = useWindowSize();

    const navigate = useNavigate();
    const selected = useRef<NavElement>();

    useToggleAwayStatus();

    function resetSelectedElement(url: string) {
        if (selected.current) {
            selected.current.classList.remove('selected-nav-element');
        }

        selected.current = undefined;
        navigate(url);
    }

    function goToPage(e: React.MouseEvent<NavElement>, url: string) {
        const target = e.currentTarget;
        if (selected.current) {
            selected.current.classList.remove('selected-nav-element');
        }

        target.classList.add('selected-nav-element');
        selected.current = target;
        navigate(url);
    }

    async function logout(): Promise<void> {
        try {
            await axios.delete<{ message: string }>(`/api/users/session`);
            userContext.socket?.volatile.emit("update-user-status", userContext.userData.username, UserStatus.OFFLINE);
            userContext.setUserData(INITIAL_STATE.userData);
        }
        catch (_: any) {
            // Ignore error message and do nothing if session is invalid or expired.
        }
    }

    function toggleSidebar(): void {
        setSidebar((cur) => !cur);
    }
    
    return (
        <>
            <AnimatePresence>
                {signUp && <SignUp setSignUp={setSignUp} setLogIn={setLogIn} setAccountCreated={setAccountCreated} />}
                {logIn && <LogIn setLogIn={setLogIn} setSignUp={setSignUp} />}
                {accountCreated && <AccountCreated setAccountCreated={setAccountCreated} />}
                {savedSellersPopUp &&
                <Sellers
                    search=""
                    url={`/api/users/${userContext.userData.username}/saved/sellers`}
                    setSellersPopUp={setSavedSellersPopUp}
                    savedSellers={true}
                    option={SellerOptions.REMOVE}
                />}
                {sidebar && windowSize < 1610 && 
                <Sidebar 
                    setLogIn={setLogIn}
                    setSignUp={setSignUp}
                    setSavedSellersPopUp={setSavedSellersPopUp}
                    toggleSidebar={toggleSidebar}
                    logout={logout}
                    windowSize={windowSize}
                />}
            </AnimatePresence>
            <nav className={`flex gap-8 items-center ${windowSize >= 560 ? "px-7" : windowSize >= 400 ? "px-5" : "px-3"} 
            h-[90px] border-b border-b-light-border-gray bg-main-white`}>
                <ul className="flex items-center gap-7 list-none flex-grow">
                    {windowSize < 1610 && 
                    <HamburgerMenu
                        size={28}
                        action={toggleSidebar}
                    />}
                    {(windowSize >= 450 || userContext.userData.username === "") &&
                    <li className="text-main-blue text-[20px] cursor-pointer mr-8" 
                    onClick={() => resetSelectedElement(`/`)}>
                        FreeFinder
                    </li>}
                    {windowSize >= 865 && 
                    <>
                        <li className="nav-item" onClick={(e) => goToPage(e, 'posts/all')}>
                            Browse all
                        </li>
                        {userContext.userData.seller &&
                        <>
                            <li className="nav-item" onClick={(e) => goToPage(e, `${userContext.userData.username}/client-orders`)}>
                                Client orders
                            </li>
                        </>}
                    </>}
                    {userContext.userData.userID !== "" && windowSize >= 1200 &&
                    <>
                        <li className="nav-item" onClick={(e) => goToPage(e, `${userContext.userData.username}/orders`)}>
                            My orders
                        </li>
                        <li>
                            <NavDropdown title="Saved" textSize={16}>
                                <DropdownElement
                                    text="Services"
                                    action={() => navigate(`/${userContext.userData.username}/saved/posts`)}
                                />
                                <DropdownElement
                                    text="Sellers"
                                    action={() => setSavedSellersPopUp(true)}
                                />
                            </NavDropdown>
                        </li>
                        <li className="nav-item" onClick={(e) => goToPage(e, `${userContext.userData.username}/posts`)}>
                            My services
                        </li>
                    </>}
                    {((windowSize >= 1610 && userContext.userData.username !== "") || 
                    (windowSize >= 1150 && userContext.userData.username === "")) && 
                    <SearchSellers 
                        styles="ml-8" 
                    />}
                </ul>
                {userContext.userData.username !== "" && <ProfileMenu logout={logout} />}
                {userContext.userData.username === "" && windowSize > 523 &&
                <AccountOptions 
                    setLogIn={setLogIn} 
                    setSignUp={setSignUp} 
                    btnStyles="w-[110px]"
                />}
            </nav>
            <div>
                <OnlineStatus />
                <Outlet />
            </div>
        </>
    );
}

export default Navbar;
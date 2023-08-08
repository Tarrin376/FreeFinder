import { useState, useContext, useRef } from 'react';
import SignUp from '../components/SignUp';
import LogIn from '../components/LogIn';
import AccountCreated from '../components/AccountCreated';
import { IUserContext, UserContext } from '../providers/UserContext';
import { Outlet } from 'react-router-dom';
import ProfileMenu from '../components/ProfileMenu';
import { useNavigate } from 'react-router-dom';
import SearchSellers from '../components/SearchSellers';
import { useToggleAwayStatus } from '../hooks/useToggleAwayStatus';
import Sellers from '../components/Sellers';
import { AnimatePresence } from "framer-motion";
import { SellerOptions } from '../enums/SellerOptions';
import { useWindowSize } from '../hooks/useWindowSize';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from './Sidebar';
import AccountOptions from '../components/AccountOptions';
import { INITIAL_STATE } from '../providers/UserContext';
import axios from "axios";
import OnlineStatus from '../components/OnlineStatus';
import NavDropdown from '../components/NavDropdown';
import { NavElement } from '../types/NavElement';

function Navbar() {
    const [signUp, setSignUp] = useState<boolean>(false);
    const [logIn, setLogIn] = useState<boolean>(false);
    const [accountCreated, setAccountCreated] = useState<boolean>(false);
    const userContext = useContext<IUserContext>(UserContext);
    const [savedSellersPopUp, setSavedSellersPopUp] = useState<boolean>(false);
    const [savedDropdown, setSavedDropdown] = useState<boolean>(false);
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
            userContext.setUserData(INITIAL_STATE.userData);
        }
        catch (_: any) {
            // Ignore error message and do nothing if session is invalid or expired.
        }
    }

    function toggleSavedDropdown(): void {
        setSavedDropdown((cur) => !cur);
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
                {sidebar && windowSize <= 1381 && 
                <Sidebar 
                    setLogIn={setLogIn}
                    setSignUp={setSignUp}
                    setSavedSellersPopUp={setSavedSellersPopUp}
                    toggleSidebar={toggleSidebar}
                    toggleSavedDropdown={toggleSavedDropdown}
                    logout={logout}
                    savedDropdown={savedDropdown}
                    windowSize={windowSize}
                />}
            </AnimatePresence>
            <nav className="flex gap-8 items-center px-7 h-[90px] border-b border-b-light-border-gray bg-main-white">
                <ul className="flex items-center gap-7 list-none flex-grow">
                    {windowSize <= 1381 && 
                    <HamburgerMenu
                        size={30}
                        action={toggleSidebar}
                    />}
                    {windowSize > 400 && 
                    <li className="text-main-blue text-[22px] cursor-pointer mr-8" 
                    onClick={() => resetSelectedElement(`/`)}>
                        FreeFinder
                    </li>}
                    {windowSize > 681 && 
                    <>
                        <li className="nav-item" onClick={(e) => goToPage(e, 'posts/all')}>
                            Browse all
                        </li>
                        {userContext.userData.seller &&
                        <>
                            <li className="nav-item">
                                Client orders
                            </li>
                        </>}
                    </>}
                    {userContext.userData.userID !== "" && windowSize > 1005 &&
                    <>
                        <li>
                            <NavDropdown
                                title="Orders"
                                items={[
                                    ["My orders", (e) => goToPage(e as React.MouseEvent<NavElement>, `/${userContext.userData.username}/saved/posts`)],
                                    ["Order requests", () => setSavedSellersPopUp(true)]
                                ]}
                            />
                        </li>
                        <li>
                            <NavDropdown
                                title="Saved"
                                items={[
                                    ["Services", (e) => goToPage(e as React.MouseEvent<NavElement>, `/${userContext.userData.username}/saved/posts`)],
                                    ["Sellers", () => setSavedSellersPopUp(true)]
                                ]}
                            />
                        </li>
                        <li className="nav-item" onClick={(e) => goToPage(e, `${userContext.userData.username}/posts`)}>
                            My services
                        </li>
                    </>}
                    {windowSize > 1381 && <SearchSellers styles="ml-8" />}
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
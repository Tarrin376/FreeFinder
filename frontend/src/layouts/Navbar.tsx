import { useState, useContext, useRef } from 'react';
import SignUp from '../components/SignUp';
import LogIn from '../components/LogIn';
import AccountCreated from '../components/AccountCreated';
import { IUserContext, UserContext } from '../providers/UserContext';
import { Outlet } from 'react-router-dom';
import ProfileMenu from '../components/ProfileMenu';
import AccountSettings from '../views/AccountSettings/AccountSettings';
import ChangeSellerDetails from '../components/ChangeSellerDetails';
import { useNavigate } from 'react-router-dom';
import SearchSellers from '../components/SearchSellers';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import CloseSmallIcon from "../assets/close-small.png";
import { useToggleAwayStatus } from '../hooks/useToggleAwayStatus';
import DropdownIcon from "../assets/dropdown.png";
import OutsideClickHandler from 'react-outside-click-handler';
import Sellers from '../components/Sellers';
import { AnimatePresence } from "framer-motion";
import { SellerOptions } from '../enums/SellerOptions';

function Navbar() {
    const [signUp, setSignUp] = useState<boolean>(false);
    const [logIn, setLogIn] = useState<boolean>(false);
    const [accountCreated, setAccountCreated] = useState<boolean>(false);
    const userContext = useContext<IUserContext>(UserContext);
    const [settingsPopUp, setSettingsPopUp] = useState<boolean>(false);
    const [sellerProfilePopUp, setSellerProfilePopUp] = useState<boolean>(false);
    const [savedSellersPopUp, setSavedSellersPopUp] = useState<boolean>(false);
    const [savedDropdown, setSavedDropdown] = useState<boolean>(false);

    const navigate = useNavigate();
    const selected = useRef<HTMLLIElement | HTMLDivElement | HTMLParagraphElement>();

    const resetSelectedElement = (url: string) => {
        if (selected.current) {
            selected.current.classList.remove('selected-nav-element');
        }

        selected.current = undefined;
        navigate(url);
    }

    const goToPage = (e: React.MouseEvent<HTMLLIElement | HTMLDivElement | HTMLParagraphElement>, url: string) => {
        const target = e.currentTarget;
        if (selected.current) {
            selected.current.classList.remove('selected-nav-element');
        }

        target.classList.add('selected-nav-element');
        selected.current = target;
        navigate(url);
    }

    function toggleSavedDropdown() {
        setSavedDropdown((cur) => !cur);
    }
    
    useToggleAwayStatus();
    
    return (
        <>
            <AnimatePresence>
                {settingsPopUp && <AccountSettings setSettingsPopUp={setSettingsPopUp} />}
                {signUp && <SignUp setSignUp={setSignUp} setLogIn={setLogIn} setAccountCreated={setAccountCreated} />}
                {logIn && <LogIn setLogIn={setLogIn} setSignUp={setSignUp} />}
                {accountCreated && <AccountCreated setAccountCreated={setAccountCreated} />}
                {sellerProfilePopUp && <ChangeSellerDetails setSellerProfilePopUp={setSellerProfilePopUp} />}
                {savedSellersPopUp &&
                <Sellers
                    search=""
                    url={`/api/users/${userContext.userData.username}/saved/sellers`}
                    setSellersPopUp={setSavedSellersPopUp}
                    savedSellers={true}
                    option={SellerOptions.REMOVE}
                />}
            </AnimatePresence>
            <nav className="flex gap-8 items-center px-7 h-[90px] border-b border-b-very-light-gray bg-main-white">
                <ul className="flex items-center gap-14 list-none">
                    <li className="text-main-blue text-[23px] cursor-pointer mr-8 font-normal" 
                    onClick={() => resetSelectedElement(`/`)}>
                        FreeFinder
                    </li>
                    <li className="nav-item" onClick={(e) => goToPage(e, 'posts/all')}>Browse all</li>
                    {userContext.userData.seller &&
                    <>
                        <li className="nav-item">Client orders</li>
                    </>}
                    {userContext.userData.userID !== "" &&
                    <>
                        <li className="nav-item">My orders</li>
                        <li className="cursor-pointer relative" onClick={toggleSavedDropdown}>
                            <div className="flex items-center gap-1 ">
                                <span>Saved</span>
                                <img src={DropdownIcon} className="w-[16px] h-[16px]" alt="" />
                            </div>
                            {savedDropdown &&
                            <OutsideClickHandler onOutsideClick={toggleSavedDropdown}>
                                <div className="absolute bg-main-white top-[30px] left-0 flex flex-col rounded-[6px] 
                                border border-light-gray shadow-profile-page-container overflow-hidden w-[120px] z-20">
                                    <p className="cursor-pointer hover:bg-main-white-hover 
                                    profile-menu-element pt-[6px] pb-[6px]" 
                                    onClick={(e) => goToPage(e, `/${userContext.userData.username}/saved/posts`)}>
                                        posts
                                    </p>
                                    <p className="cursor-pointer hover:bg-main-white-hover 
                                    profile-menu-element pt-[6px] pb-[6px]" onClick={() => setSavedSellersPopUp(true)}>
                                        sellers
                                    </p>
                                </div>
                            </OutsideClickHandler>}
                        </li>
                        <li className="nav-item" onClick={(e) => goToPage(e, `${userContext.userData.username}/posts`)}>
                            My posts
                        </li>
                    </>}
                    <SearchSellers />
                </ul>
                <div className="flex ml-auto gap-4 items-center">
                    {userContext.userData.username === "" ? 
                    <AccountOptions setLogIn={setLogIn} setSignUp={setSignUp} /> :
                    <ProfileMenu 
                        setSettingsPopUp={setSettingsPopUp} 
                        setSellerProfilePopUp={setSellerProfilePopUp}
                        />}
                </div>
            </nav>
            <div>
                <OnlineStatus />
                <Outlet />
            </div>
        </>
    );
}

function AccountOptions({ setLogIn, setSignUp }: {
    setLogIn: React.Dispatch<React.SetStateAction<boolean>>,
    setSignUp: React.Dispatch<React.SetStateAction<boolean>>}) {
    return (
        <>
            <button className="btn-primary bg-very-light-gray hover:bg-very-light-gray-hover w-[110px]" 
            onClick={() => setLogIn(true)}>
                Log In
            </button>
            <button className="btn-primary bg-main-black text-main-white hover:bg-main-black-hover w-[110px]" 
            onClick={() => setSignUp(true)}>
                Sign Up
            </button>
        </>
    );
}

function OnlineStatus() {
    const { onlineMessage, offlineMessage, closePopUp } = useOnlineStatus();

    if (!onlineMessage && !offlineMessage) {
        return <></>
    }

    return (
        <div className={`w-[100vw] px-7 relative ${onlineMessage ? "bg-light-green " : "bg-error-text"} text-center p-2 z-20`}>
            <p className="text-main-white">
                {onlineMessage ? onlineMessage : offlineMessage}
            </p>
            <img 
                src={CloseSmallIcon} 
                className="text-main-white w-[20px] h-[20px] absolute top-1/2 translate-y-[-50%] right-7 cursor-pointer" 
                alt="close"
                onClick={closePopUp}
            />
        </div>
    )
}

export default Navbar;
import SearchIcon from '../assets/search.png';
import { useState, useContext, useRef } from 'react';
import SignUp from '../components/SignUp';
import LogIn from '../components/LogIn';
import AccountCreated from '../components/AccountCreated';
import { IUserContext, UserContext } from '../providers/UserContext';
import { Outlet } from 'react-router-dom';
import ProfileMenu from '../components/ProfileMenu';
import AccountSettings from '../views/AccountSettings/AccountSettings';
import SellerProfile from '../components/SellerProfile';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const [signUp, setSignUp] = useState<boolean>(false);
    const [logIn, setLogIn] = useState<boolean>(false);
    const [accountCreated, setAccountCreated] = useState<boolean>(false);
    const userContext = useContext<IUserContext>(UserContext);
    const [settingsPopUp, setSettingsPopUp] = useState<boolean>(false);
    const [sellerProfilePopUp, setSellerProfilePopUp] = useState<boolean>(false);
    const navigate = useNavigate();
    const selected = useRef<HTMLLIElement>();

    const goToPage = (e: React.MouseEvent<HTMLLIElement>, url: string) => {
        const target = e.currentTarget;
        if (selected.current) selected.current.classList.remove('selected-nav-element');
        target.classList.add('selected-nav-element');
        selected.current = target;
        navigate(url);
    }
    
    return (
        <>
            {settingsPopUp && <AccountSettings setSettingsPopUp={setSettingsPopUp} userContext={userContext} />}
            {signUp && <SignUp setSignUp={setSignUp} setLogIn={setLogIn} setAccountCreated={setAccountCreated} />}
            {logIn && <LogIn setLogIn={setLogIn} setSignUp={setSignUp} />}
            {accountCreated && <AccountCreated setAccountCreated={setAccountCreated} />}
            {sellerProfilePopUp && <SellerProfile setSellerProfilePopUp={setSellerProfilePopUp} />}
            <nav className="flex gap-8 items-center px-7 h-[90px] border-b border-b-very-light-gray bg-white">
                <ul className="flex items-center xl:gap-14 lg:gap-9">
                    <li className="text-main-blue text-2xl cursor-pointer mr-8" onClick={(e) => goToPage(e, `/`)}>FreeFinder</li>
                    <li className="nav-item">Browse all</li>
                    {userContext.userData.seller &&
                    <>
                        <li className="nav-item">Client orders</li>
                    </>}
                    {userContext.userData.userID !== "" &&
                    <>
                        <li className="nav-item">My orders</li>
                        <li className="nav-item" onClick={(e) => goToPage(e, `${userContext.userData.username}/saved-posts`)}>Saved posts</li>
                        <li className="nav-item" onClick={(e) => goToPage(e, `${userContext.userData.username}/posts`)}>My posts</li>
                    </>}
                    <div className="flex items-center border border-light-gray 
                        rounded-[8px] px-3 h-10 xl:w-96 lg:w-80 bg-transparent max-w-[330px]">
                        <img src={SearchIcon} alt="" className="w-5 h-5 cursor-pointer"/>
                        <input 
                            type="text" 
                            placeholder="Search for sellers" 
                            className="focus:outline-none placeholder-search-text bg-transparent ml-3" 
                        />
                    </div>
                </ul>
                <div className="flex ml-auto gap-4 items-center">
                    {userContext.userData.username === "" ? 
                    <AccountOptions setLogIn={setLogIn} setSignUp={setSignUp} /> :
                    <ProfileMenu 
                        userContext={userContext} 
                        setSettingsPopUp={setSettingsPopUp} 
                        setSellerProfilePopUp={setSellerProfilePopUp}
                        />}
                </div>
            </nav>
            <Outlet />
        </>
    );
}

function AccountOptions({ setLogIn, setSignUp }: {
    setLogIn: React.Dispatch<React.SetStateAction<boolean>>,
    setSignUp: React.Dispatch<React.SetStateAction<boolean>>}) {
    return (
        <>
            <button className="btn-primary bg-very-light-gray hover:bg-very-light-gray-hover" 
            onClick={() => setLogIn(true)}>
                Log In
            </button>
            <button className="btn-primary bg-main-black text-main-white hover:bg-main-black-hover" 
            onClick={() => setSignUp(true)}>
                Sign Up
            </button>
        </>
    );
}

export default Navbar;
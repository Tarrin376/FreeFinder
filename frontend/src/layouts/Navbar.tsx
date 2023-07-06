import { useState, useContext, useRef } from 'react';
import SignUp from '../components/SignUp';
import LogIn from '../components/LogIn';
import AccountCreated from '../components/AccountCreated';
import { IUserContext, UserContext } from '../providers/UserContext';
import { Outlet } from 'react-router-dom';
import ProfileMenu from '../components/ProfileMenu';
import AccountSettings from '../views/AccountSettings/AccountSettings';
import SellerDetails from '../components/SellerDetails';
import { useNavigate } from 'react-router-dom';
import SearchSellers from '../components/SearchSellers';

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
        if (selected.current) {
            selected.current.classList.remove('selected-nav-element');
        }

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
            {sellerProfilePopUp && <SellerDetails setSellerProfilePopUp={setSellerProfilePopUp} />}
            <nav className="flex gap-8 items-center px-7 h-[90px] border-b border-b-very-light-gray bg-main-white">
                <ul className="flex items-center gap-14">
                    <li className="text-main-blue text-[23px] cursor-pointer mr-8 font-normal" onClick={(e) => goToPage(e, `/`)}>FreeFinder</li>
                    <li className="nav-item" onClick={(e) => goToPage(e, 'posts/all')}>Browse all</li>
                    {userContext.userData.seller &&
                    <>
                        <li className="nav-item">Client orders</li>
                    </>}
                    {userContext.userData.userID !== "" &&
                    <>
                        <li className="nav-item">My orders</li>
                        <li className="nav-item" onClick={(e) => goToPage(e, `${userContext.userData.username}/saved`)}>Saved posts</li>
                        <li className="nav-item" onClick={(e) => goToPage(e, `${userContext.userData.username}/posts`)}>My posts</li>
                    </>}
                    <SearchSellers />
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
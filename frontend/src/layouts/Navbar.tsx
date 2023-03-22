import SearchIcon from '../assets/search.png';
import { useState, useContext } from 'react';
import SignUp from '../components/SignUp';
import LogIn from '../components/LogIn';
import AccountCreated from '../components/AccountCreated';
import { IUserContext, UserContext } from '../context/UserContext';
import { Outlet, Link } from 'react-router-dom';
import ProfileMenu from '../components/ProfileMenu';
import Settings from '../components/Settings';

function Navbar() {
    const [signUp, setSignUp] = useState<boolean>(false);
    const [logIn, setLogIn] = useState<boolean>(false);
    const [accountCreated, setAccountCreated] = useState<boolean>(false);
    const userContext = useContext<IUserContext>(UserContext);
    const [settingsPopUp, setSettingsPopUp] = useState<boolean>(false);
    
    return (
        <>
            {settingsPopUp && <Settings setSettingsPopUp={setSettingsPopUp} userContext={userContext} />}
            {signUp && <SignUp setSignUp={setSignUp} setLogIn={setLogIn} setAccountCreated={setAccountCreated} />}
            {logIn && <LogIn setLogIn={setLogIn} setSignUp={setSignUp} />}
            {accountCreated && <AccountCreated setAccountCreated={setAccountCreated} />}
            <nav className="px-5 h-[90px] border-b border-b-light-gray bg-main-white">
                <div className="max-w-screen-xxl m-auto h-full flex gap-8 items-center">
                    <div className="flex xl:gap-16 lg:gap-12 items-center justify-between">
                        <div className="text-main-purple text-2xl"><Link to="/">FreeFinder</Link></div>
                        <ul className="flex items-center xl:gap-11 lg:gap-9 xl:ml-14 lg:ml-5">
                            <li className="nav-item">Browse</li>
                            <li className="nav-item">Orders</li>
                            <Link to={`${userContext.userData.username}/saved`}>
                                <li className="nav-item">Saved Services</li>
                            </Link>
                            <Link to={`${userContext.userData.username}/my-posts`}>
                                <li className="nav-item">My Posts</li>
                            </Link>
                            <div className="flex items-center border-2 border-light-gray 
                                rounded-[8px] px-3 h-10 xl:w-96 lg:w-80 bg-transparent">
                                <img src={SearchIcon} alt="search-icon" className="w-5 h-5 cursor-pointer"/>
                                <input type="text" placeholder="Search for sellers" className="w-full h-full 
                                focus:outline-none placeholder-search-text text-main-black bg-transparent ml-3" />
                            </div>
                        </ul>
                    </div>
                    <div className="flex ml-auto gap-4 items-center">
                        {userContext.userData.username === "" ? 
                        <AccountOptions setLogIn={setLogIn} setSignUp={setSignUp} /> :
                        <ProfileMenu userContext={userContext} setSettingsPopUp={setSettingsPopUp} />}
                    </div>
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
            <button className="btn-primary bg-very-light-gray text-main-black hover:bg-very-light-gray-hover" 
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
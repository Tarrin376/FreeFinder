interface AccountOptionsProps {
    setLogIn: React.Dispatch<React.SetStateAction<boolean>>,
    setSignUp: React.Dispatch<React.SetStateAction<boolean>>,
    action?: () => void,
    styles?: string,
    btnStyles?: string
}

function AccountOptions({ setLogIn, setSignUp, action, styles, btnStyles }: AccountOptionsProps) {
    const defaultStyles = `flex items-center gap-4`;

    function handleLogIn() {
        if (action) action();
        setLogIn(true);
    }

    function handleSignUp() {
        if (action) action();
        setSignUp(true);
    }

    return (
        <div className={`${defaultStyles} ${styles}`}>
            <button className={`btn-primary bg-very-light-gray hover:bg-very-light-gray-hover flex-grow ${btnStyles}`} 
            onClick={handleLogIn}>
                Log In
            </button>
            <button className={`btn-primary bg-main-black text-main-white hover:bg-main-black-hover flex-grow ${btnStyles}`}
            onClick={handleSignUp}>
                Sign Up
            </button>
        </div>
    );
}

export default AccountOptions;
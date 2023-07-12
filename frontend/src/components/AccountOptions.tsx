interface AccountOptionsProps {
    setLogIn: React.Dispatch<React.SetStateAction<boolean>>,
    setSignUp: React.Dispatch<React.SetStateAction<boolean>>,
    action?: () => void,
    styles?: string,
    btnStyles?: string
}

function AccountOptions({ setLogIn, setSignUp, action, styles, btnStyles }: AccountOptionsProps) {
    return (
        <div className={`flex items-center gap-4 ${styles}`}>
            <button className={`btn-primary bg-very-light-gray hover:bg-very-light-gray-hover flex-grow ${btnStyles}`} 
            onClick={() => {
                if (action) action();
                setLogIn(true);
            }}>
                Log In
            </button>
            <button className={`btn-primary bg-main-black text-main-white hover:bg-main-black-hover flex-grow ${btnStyles}`}
            onClick={() => {
                if (action) action();
                setSignUp(true);
            }}>
                Sign Up
            </button>
        </div>
    );
}

export default AccountOptions;
import PopUpWrapper from "../../wrappers/PopUpWrapper";

interface AccountCreatedProps {
    setAccountCreated: React.Dispatch<React.SetStateAction<boolean>>
}

function AccountCreated({ setAccountCreated }: AccountCreatedProps) {
    return (
        <PopUpWrapper setIsOpen={setAccountCreated} title="">
            <div>
                <h1 className="text-[26px] mb-2 text-center">Account successfully created!</h1>
                <p className=" text-side-text-gray text-center max-w-[440px]">
                    You can now search the market for talent, customize your profile, and sell your services to the world!
                </p>
                <button className="btn-primary text-main-white bg-main-black hover:bg-main-blue block m-auto mt-6 w-[110px]" 
                onClick={() => setAccountCreated(false)}>
                    Continue
                </button>
            </div>
        </PopUpWrapper>
    );
}

export default AccountCreated;
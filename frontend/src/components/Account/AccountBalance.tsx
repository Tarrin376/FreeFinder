import PopUpWrapper from "../../wrappers/PopUpWrapper";
import Price from "../common/Price";
import { useState, useEffect, useContext } from "react";
import axios, { AxiosError } from "axios";
import { UserContext } from "../../providers/UserProvider";
import ErrorMessage from "../Error/ErrorMessage";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import Button from "../ui/Button";
import { MAX_DEPOSIT } from "@freefinder/shared/dist/constants";

interface AccountBalanceProps {
    setBalancePopUp: React.Dispatch<React.SetStateAction<boolean>>
}

function AccountBalance({ setBalancePopUp }: AccountBalanceProps) {
    const [balance, setBalance] = useState<number>();
    const [amount, setAmount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userContext = useContext(UserContext);
    const endpoint = `/api/users/${userContext.userData.username}/balance`;

    async function addToBalance(): Promise<string | undefined> {
        try {
            const resp = await axios.put<{ balance: number, message: string }>(endpoint, { amount: amount });
            setBalance(resp.data.balance);
        }
        catch (err: any) {
            const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
            return errorMessage;
        }
    }

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const resp = await axios.get<{ balance: number, message: string }>(endpoint);
                setBalance(resp.data.balance);
            }
            catch (err: any) {
                const errorMessage = getAPIErrorMessage(err as AxiosError<{ message: string }>);
                setErrorMessage(errorMessage);
            }
        })();
    }, [endpoint]);

    return (
        <PopUpWrapper setIsOpen={setBalancePopUp} title="Account Balance">
            <div>
                {errorMessage !== "" && 
                <ErrorMessage 
                    message={errorMessage} 
                    setErrorMessage={setErrorMessage} 
                    title="Something went wrong"
                    styles="mb-7"
                />}
                <p className="text-side-text-gray pb-5 border-b border-light-border-gray">
                    This balance will be used on your next service payment.
                </p>
                <div className="mt-7 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex-grow">
                        <p className="text-sm text-side-text-gray mb-[-2px]">Total balance</p>
                        <p className={`text-[2rem] ${balance === undefined && "loading w-[120px] h-[36px] mt-3"}`}>
                            {balance !== undefined ? `£${balance.toFixed(2)}` : ""}
                        </p>
                    </div>
                    <Price 
                        value={amount} 
                        maxValue={MAX_DEPOSIT}
                        text="Amount (max £500)" 
                        updateValue={(cur) => setAmount(cur)}
                    />
                </div>
                <Button
                    action={addToBalance}
                    completedText="Added to balance"
                    defaultText="Add to balance"
                    loadingText="Adding to balance"
                    styles={`main-btn mt-7 ${amount === 0 ? "invalid-button" : ""}`}
                    textStyles="text-main-white"
                    setErrorMessage={setErrorMessage}
                    loadingSvgSize={28}
                    whenComplete={() => setAmount(0)}
                    keepErrorMessage={true}
                />
            </div>
        </PopUpWrapper>
    )
}

export default AccountBalance;
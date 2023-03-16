import PopUpWrapper from "../layouts/PopUpWrapper";
import { useState, useContext } from 'react';
import LoadingButton from "./LoadingButton";
import { UserContext } from "../context/UserContext";
import { IUserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const MAX_PRICE: number = 2500;

interface PostServiceProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>
}

function PostService({ setPostService }: PostServiceProps) {
    const [startingPrice, setStartingPrice] = useState<number>(0);
    const [title, setTitle] = useState<string>("");
    const [about, setAbout] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const userContext: IUserContext = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function createPost(): Promise<void> {
        setLoading(true);
        
        try {
            const create = await fetch(`/post/createPost/${userContext.userData.userID}`, {
                method: 'POST',
                body: JSON.stringify({
                    about: about,
                    title: title,
                    startingPrice: startingPrice
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then((res) => {
                return res.json();
            });

            if (create.message === "success") {
                setErrorMessage("");
                setPostService(false);
            } else {
                setErrorMessage(create.message);
            }
        }
        catch (err: any) {
            setErrorMessage(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    function validInputs(): boolean {
        return title.length > 0 && about.length > 0 && startingPrice > 0;
    }

    function updateStartingPrice(e: React.ChangeEvent<HTMLInputElement>): void {
        const currencyPattern: RegExp = new RegExp("^[1-9]{1}[0-9]+([.][0-9]{2})?$");
        const price: string = e.target.value;

        if (price.match(currencyPattern) && +price <= MAX_PRICE) {
            setStartingPrice(+price);
        } else {
            setStartingPrice(0);
        }
    }

    return (
        <PopUpWrapper setIsOpen={setPostService}>
            <h1 className="text-[26px] mb-4">Post a service</h1>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"Unable to create post."} />}
            <h2 className="mb-2">Starting price (minimum of £10)</h2>
            <div className="flex items-center search-bar mb-4">
                <p className="select-none">£</p>
                <input type="number" step=".01" min={1} max={2500} className="w-full h-full 
                focus:outline-none placeholder-search-text text-main-black bg-transparent ml-3" onChange={(e) => updateStartingPrice(e)} />
            </div>
            <p className="mb-1">Title</p>
            <input type="text" className="search-bar mb-4" placeholder="Enter title" onChange={(e) => setTitle(e.target.value)} />
            <p className="mb-1">Write about section</p>
            <textarea placeholder="Write about your service here" className="w-full search-bar mb-6" 
            onChange={(e) => setAbout(e.target.value)} rows={5} maxLength={1500}></textarea>
            <LoadingButton
                loading={loading} text="Post your service" loadingText="Creating post..."
                callback={createPost} styles={`max-w-[220px] ml-auto ${!validInputs() ? "invalid-button" : "btn-primary action-btn"}`}
                disabled={false} loadingColour="bg-[#36BF54]"
            />
        </PopUpWrapper>
    );
}

export default PostService;
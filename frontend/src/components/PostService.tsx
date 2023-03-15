import PopUpWrapper from "../layouts/PopUpWrapper";
import { useState } from 'react';

const MAX_PRICE: number = 2500;

interface PostServiceProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>
}

function PostService({ setPostService }: PostServiceProps) {
    const [startingPrice, setStartingPrice] = useState<number>(0);
    const [title, setTitle] = useState<string>("");
    const [about, setAbout] = useState<string>("");

    function post(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
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
            onChange={(e) => setAbout(e.target.value)} rows={5}></textarea>
            <div className="flex items-center justify-between gap-2">
                <p className="text-side-text-gray text-[15px]">Your about section must be at most 1500 characters</p>
                <button className={`w-[220px] ${!validInputs() ? "invalid-button" : "btn-primary action-btn"}`} 
                type="submit" onClick={post} disabled={!validInputs()}>Post your service!</button>
            </div>
        </PopUpWrapper>
    );
}

export default PostService;
import PopUpWrapper from "../../layouts/PopUpWrapper";
import ErrorMessage from "../../components/ErrorMessage";
import { categories } from "../../utils/jobCategories";
import LoadingButton from "../../components/LoadingButton";
import { Sections } from "../../types/Sections";

const MAX_PRICE: number = 2500;

interface PostDetailsProps {
    setPostService: React.Dispatch<React.SetStateAction<boolean>>,
    setSection: React.Dispatch<React.SetStateAction<Sections>>,
    setAbout: React.Dispatch<React.SetStateAction<string>>,
    setTitle: React.Dispatch<React.SetStateAction<string>>, 
    setStartingPrice: React.Dispatch<React.SetStateAction<number>>, 
    createPost: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<any>,
    about: string
    title: string
    startingPrice: number
    errorMessage: string
    loading: boolean,
}

function PostDetails({ setPostService, setSection, about, setAbout, title, setTitle, startingPrice, 
    setStartingPrice, errorMessage, loading, createPost }: PostDetailsProps) {
    function validInputs(): boolean {
        return title.trim().length > 0 && about.trim().length > 0 && startingPrice > 0;
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
        <PopUpWrapper setIsOpen={setPostService} title={"Enter post details"}>
            {errorMessage !== "" && <ErrorMessage message={errorMessage} title={"Unable to create post."} />}
            <h2 className="mb-2">What category does your service fall under?</h2>
            <select className="p-2 search-bar cursor-pointer mb-4">
                {Object.keys(categories).map((category) => <option>{category}</option>)}
            </select>
            <h2 className="mb-2">Starting price (£10 - £2500)</h2>
            <div className="flex items-center search-bar mb-4">
                <p className="select-none">£</p>
                <input type="number" step=".01" min={1} max={2500} defaultValue={startingPrice} className="w-full h-full 
                focus:outline-none placeholder-search-text text-main-black bg-transparent ml-3" onChange={(e) => updateStartingPrice(e)} />
            </div>
            <h2 className="mb-2">Title</h2>
            <input type="text" className="search-bar mb-4" value={title} 
            maxLength={100} placeholder="Enter title" onChange={(e) => setTitle(e.target.value)} />
            <h2 className="mb-2">Write about section</h2>
            <textarea placeholder="Write about your service here" className="w-full search-bar mb-6" value={about}
            onChange={(e) => setAbout(e.target.value)} rows={5} maxLength={1500}></textarea>
            <div className="flex justify-end gap-3 mt-[35px]">
                <button className="bg-main-white border-2 border-light-gray btn-primary w-[110px] px-3 font-semibold
                hover:bg-main-white-hover" onClick={() => setSection(Sections.UploadFiles)}>
                    Back
                </button>
                <LoadingButton
                    loading={loading} text="Post service" loadingText="Creating post..."
                    callback={createPost} styles={`w-[185px] px-3 ${!validInputs() ? "invalid-button" : "btn-primary action-btn"}`}
                    disabled={false} loadingColour="bg-[#36BF54]"
                />
            </div>
        </PopUpWrapper>
    );
}

export default PostDetails;
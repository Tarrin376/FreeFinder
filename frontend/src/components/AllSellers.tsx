import PopUpWrapper from "../wrappers/PopUpWrapper";

interface AllSellersProps {
    search: string,
    setAllSellersPopUp: React.Dispatch<React.SetStateAction<boolean>>,
}

function AllSellers({ search, setAllSellersPopUp }: AllSellersProps) {
    return (
        <PopUpWrapper title="sellers found" setIsOpen={setAllSellersPopUp}>

        </PopUpWrapper>
    )
}

export default AllSellers;
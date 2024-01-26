import Price from "../Price";
import { MAX_SERVICE_PRICE } from "@freefinder/shared/dist/constants";
import CountriesDropdown from "../Dropdown/CountriesDropdown";
import DeliveryTimes from "../DeliveryTimes";
import SearchLanguages from "../SearchLanguages";
import SellerLevels from "../Seller/SellerLevels";
import TypeOfWork from "../TypeOfWork";
import ExtraFilters from "./ExtraFilters";
import { FilterPostsProviderState } from "src/providers/FilterPostsProvider";
import { useWindowSize } from "src/hooks/useWindowSize";

interface FiltersProps {
    loading: boolean,
    dispatch: React.Dispatch<Partial<FilterPostsProviderState>>,
    state: FilterPostsProviderState
}

function Filters({ loading, dispatch, state }: FiltersProps) {
    const windowSize = useWindowSize();

    return (
        <div>
            {windowSize < 1650 &&
            <div className="flex items-center justify-between gap-3 pb-5 mb-5 border-b border-light-border-gray">
                <Price
                    value={state.min} 
                    maxValue={MAX_SERVICE_PRICE}
                    text="min price" 
                    updateValue={(cur: number) => dispatch({ min: cur })}
                />
                <div>-</div>
                <Price 
                    value={state.max} 
                    maxValue={MAX_SERVICE_PRICE}
                    text="max price" 
                    updateValue={(cur: number) => dispatch({ max: cur })}
                />
            </div>}
            <div className="border-b border-light-border-gray pb-5 mb-5">
                <CountriesDropdown 
                    country={state.country}
                    updateCountry={(country: string) => dispatch({ country: country })}
                    text="Seller lives in"
                    anyLocation={true}
                />
            </div>
            <DeliveryTimes 
                loading={loading}  
                deliveryTime={state.deliveryTime}
                updateDeliveryTime={(newDeliveryTime: number) => dispatch({ deliveryTime: newDeliveryTime })}
            />
            <h3 className="text-side-text-gray mt-5 mb-2 text-[16px]">
                Seller speaks
            </h3>
            <SearchLanguages 
                loading={loading}
                updateLanguages={(languages: string[]) => dispatch({ selectedLanguages: languages })}
                selectedLanguages={state.selectedLanguages}
                searchBarStyles="h-10"
                styles="border-b border-light-border-gray pb-5"
            />
            <SellerLevels 
                loading={loading}
                sellerLevels={state.sellerLevels}
                updateSellerLevels={(sellerLevels: string[]) => dispatch({ sellerLevels: sellerLevels })} 
            />
            <TypeOfWork 
                selectedWork={state.selectedWork}
                updateSelectedWork={(selectedWork: string[]) => dispatch({ selectedWork: selectedWork })}
            />
            <ExtraFilters 
                loading={loading}
                extraFilters={state.extraFilters}
                updateExtraFilters={(extraFilters: string[]) => dispatch({ extraFilters: extraFilters })}
            />     
        </div>
    )
}

export default Filters;
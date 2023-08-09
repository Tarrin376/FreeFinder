import Price from "./Price";
import { MAX_SERVICE_PRICE } from "@freefinder/shared/dist/constants";
import CountriesDropdown from "./CountriesDropdown";
import DeliveryTimes from "./DeliveryTimes";
import SearchLanguages from "./SearchLanguages";
import SellerLevels from "./SellerLevels";
import TypeOfWork from "./TypeOfWork";
import ExtraFilters from "./ExtraFilters";
import { FilterPostsProviderState } from "src/providers/FilterPostsProvider";

interface FiltersProps {
    loading: boolean,
    deliveryTime: React.MutableRefObject<number>,
    searchHandler: () => void,
    dispatch: React.Dispatch<Partial<FilterPostsProviderState>>,
    state: FilterPostsProviderState
}

function Filters({ loading, deliveryTime, searchHandler, dispatch, state }: FiltersProps) {
    return (
        <>
            <div className="flex items-center justify-between gap-3 pb-5 mb-5 min-[1561px]:hidden border-b border-light-border-gray">
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
            </div>
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
                searchHandler={searchHandler} 
                deliveryTime={deliveryTime} 
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
        </>
    )
}

export default Filters;
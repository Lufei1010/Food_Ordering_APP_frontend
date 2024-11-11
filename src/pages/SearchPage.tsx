import { useSearchRestaurants } from "@/api/RestaurantApi";
import CuisineFilter from "@/components/CuisineFilter";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import SearchResultCard from "@/components/SearchResultCard";
import SearchResultInfo from "@/components/SearchResultInfo";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type SearchState = {
  searchQuery: string;
  page: number;
  selectedCuisines: string[];
};
const SearchPage = () => {
  const { city } = useParams();
  // default empty when the page loads at the first time
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: "",
    page: 1,
    selectedCuisines: [],
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { results, isLoading } = useSearchRestaurants(searchState, city); //api hook

  const setSelectedCuisines = (selectedCuisines: string[]) => {
    console.log("Setting selected cuisines in SearchPage:", selectedCuisines);
    setSearchState((prevState) => ({
      ...prevState,
      selectedCuisines,
      page: 1, // reset the page to 1 when the cuisines are selected or deselected
    }));
  };

  const setPage = (page: number) => {
    setSearchState((prevState) => ({
      ...prevState,
      page,
    }));
  };

  const setSearchQuery = (searchFormData: SearchForm) => {
    console.log("API call with cuisines:", searchState.selectedCuisines); 
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: searchFormData.searchQuery, // update the searchQuery with the new search value
      page: 1, // reset the page to 1 when a new search is performed
    }));
  };

  const resetSearch = () => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: "",
      page: 1,
    }));
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (!results?.data || !city) {
    return <span>No results found</span>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gapt-5 p-4 sm:p-6">
      <div id="cuisines-list">
        <CuisineFilter
          selectedCuisines={searchState.selectedCuisines}
          onChange={setSelectedCuisines}
          isExpanded={isExpanded}
          onExpandedClick={() => setIsExpanded((prevIsExpanded) => !prevIsExpanded)}
        />
      </div>
      <div id="main-content" className="flex flex-col gap-5">
        {/* Renders the search bar and passes props to handle user input. */}
        <SearchBar
          searchQuery={searchState.searchQuery}
          onSubmit={setSearchQuery}
          placeholder="Search by Cuisine or Restaurant Name"
          onReset={resetSearch}
        />{" "}
        <SearchResultInfo total={results.pagination.total} city={city} />
        {results.data.map((restaurant) => (
          <SearchResultCard restaurant={restaurant} />
        ))}
        <PaginationSelector
          page={results.pagination.page}
          pages={results.pagination.pages}
          onPageChange={setPage}
        />
        {/* props, can get it from state or results(from api) */}
      </div>
    </div>
  );

  return (
    <span>
      User searched for {city}{" "}
      <span>
        {results?.data.map((restaurant) => (
          <span>
            found - {restaurant.restaurantName}, {restaurant.city}
          </span>
        ))}
      </span>
    </span>
  );
};

export default SearchPage;

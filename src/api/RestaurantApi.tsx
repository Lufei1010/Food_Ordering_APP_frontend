import { SearchState } from "@/pages/SearchPage";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyRestaurants = (restaurantId?: string) => {
  const getRestaurantRequestByIdRequest = async (): Promise<Restaurant> => {
    const response = await fetch (
      `${API_BASE_URL}/api/restaurant/${restaurantId}`
    );

    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }
    return response.json();
  };

  const { data: restaurant, isLoading } = useQuery(
    "fetchRestaurant",
    getRestaurantRequestByIdRequest,
    {
      enabled:!!restaurantId,
    }
  );

  return { restaurant, isLoading };
}

export const useSearchRestaurants = (
  searchState: SearchState,
  city?: string
) => {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    console.log("API call with cuisines:", searchState.selectedCuisines);
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery); // Add searchQuery to the request parameters
    params.set("page", searchState.page.toString()); // Add page to the request parameters
    params.set("selectedCuisines", searchState.selectedCuisines.join(",")); // array needs , ; Add selected cuisines to the request parameters
    params.set("sortOption", searchState.sortOption)
       console.log(
         "Full API request URL:",
         `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}` // <-- Edited part
       );
    //fetch request to the search endpoint, pass city as parameter
    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }

    return response.json();
  };

  const { data: results, isLoading } = useQuery(
    ["searchRestaurants", searchState],
    createSearchRequest,
    { enabled: !!city }
  );

  return { results, isLoading };
};

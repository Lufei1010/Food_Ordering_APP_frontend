import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

    

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;//API Base URL;

//getMyUserRequest: Fetches user data from an API with an authenticated request.
//useQuery: Manages fetching the data, caching it, and keeping track of loading/error states.
export const useGetMyUser = () => {
  const { getAccessTokenSilently } = useAuth0(); //without prompting the user.

  const getMyUserRequest = async (): Promise<User> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return response.json(); //it can be used it in component later
  };

  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery("fetchCurrentUser", getMyUserRequest);

  if (error) {
    toast.error(error.toString())
  }

  return { currentUser, isLoading };
};


//Create User Request Function;
type CreateUserRequest = {
    auth0Id: string;
    email: string;
};

//Fetch API Call;
export const useCreateMyUser = () => {
    const { getAccessTokenSilently } = useAuth0(); 

    const createMyUserRequest = async (user: CreateUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send access token for authorization
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
//Error Handling;
        if(!response.ok) {
            throw new Error('Failed to create user');
        }
    };
//React Query Mutation.
    const { 
        mutateAsync: CreateUser,
        isLoading, 
        isError, 
        isSuccess 
    } = useMutation(createMyUserRequest);

    return {
      CreateUser,
      isLoading,
      isError,
      isSuccess,
    };
};
//
type UpdateMyUserRequest = {
  name: string,
  addressLine1: string,
  city: string,
  country: string,
}
//hook to import components
export const useUpdateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  //fetch request
  const updataMyUserRequest = async (formData: UpdateMyUserRequest) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if(!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json()

  };

  const {
    mutateAsync: updateUser,
    isLoading, isSuccess,
    error, 
    reset 
   } = useMutation(updataMyUserRequest);

   if(isSuccess) {
    toast.success("User profile updated")
   }

   if(error) {
    toast.error(error.toString())
    reset(); //
   }

   return { updateUser, isLoading };
};
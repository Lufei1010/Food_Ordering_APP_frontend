//similar to the schema in the backend
export type User = {
    _id: string;
    email: string;
    name: string; 
    addressLine: string;
    city: string;
    country: string;
}

export type MenuItem = {
  _id: string;
  name: string;
  price: number;
};

export type Restaurant = {
  _id: string;
  user: string;
  restaurantName: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItems: MenuItem[]; //complex object, create it separately
  imageUrl: string;
  lastUpdated: string;
};

export type RestaurantSearchResponse = {
  data: Restaurant[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  }; //also defined on the backend. but for flexibility and individuality , created it here to.
}


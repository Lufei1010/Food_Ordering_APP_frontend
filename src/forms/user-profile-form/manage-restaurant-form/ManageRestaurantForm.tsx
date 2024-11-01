import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types";
import { useEffect } from "react";

const formSchema = z.object({
  restaurantName: z.string({
    required_error: "restuarant name is required",
  }),
  city: z.string({
    required_error: "city is required",
  }),
  country: z.string({
    required_error: "country is required",
  }),
  deliveryPrice: z.coerce.number({
    required_error: "delivery price is required",
    invalid_type_error: "must be a valid number",
  }),
  estimatedDeliveryTime: z.coerce.number({ //convert to number
    required_error: "estimated delivery time is required",
    invalid_type_error: "must be a valid number",
  }),
  cuisines: z.array(z.string()).nonempty({ //array
    message: "please select at least one item",
  }),
  menuItems: z.array(                       //array.object
    z.object({
      name: z.string().min(1, "name is required"),
      price: z.coerce.number().min(1, "price is required"),
    })
  ),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "image is required" }).optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image URL or image File must be provided",
    path: ["imageFile"],
});

//after schema, create a types base on schema above
type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant; //? undefined
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
}

//component
const ManageRestaurantForm = ({onSave, isLoading, restaurant }: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
    },
  });

  useEffect(() => {
    if (!restaurant) {
      return;
    }
//price lowest domination of 100 = 100pence == 1GPB
  const deliveryPriceFormatted = parseInt(
    (restaurant.deliveryPrice / 100).toFixed(2)
  );
    
  const menuItemFormatted = restaurant.menuItems.map((item) => ({
    ...item,
    price: parseInt((item.price / 100).toFixed(2))
  }));
  
  const updateRestaurant = {
    ...restaurant,
    deliveryPrice: deliveryPriceFormatted,
    menuItems: menuItemFormatted,
  }
  form.reset(updateRestaurant);
  }, [form, restaurant])

const onSubmit = (formDataJson: RestaurantFormData) => {
  const formData = new FormData();

  console.log("Form Data JSON:", formDataJson); // Log the form data

  formData.append("restaurantName", formDataJson.restaurantName);
  formData.append("city", formDataJson.city);
  formData.append("country", formDataJson.country);

  // Check delivery price and estimated delivery time
  console.log("Delivery Price:", formDataJson.deliveryPrice);
  console.log("Estimated Delivery Time:", formDataJson.estimatedDeliveryTime);

  formData.append(
    "deliveryPrice",
    (formDataJson.deliveryPrice * 100).toString()
  );
  formData.append(
    "estimatedDeliveryTime",
    formDataJson.estimatedDeliveryTime.toString()
  );
  formDataJson.cuisines.forEach((cuisine, index) => {
    formData.append(`cuisines[${index}]`, cuisine);
  });
  formDataJson.menuItems.forEach((menuItem, index) => {
    if (!menuItem.name) {
        console.error(`Menu item ${index} name is missing`);
        return; // Skip adding this menu item
    }
    if (!menuItem.price || menuItem.price <= 0) {
        console.error(`Menu item ${index} price is invalid`);
        return; // Skip adding this menu item
    }
    formData.append(`menuItems[${index}][name]`, menuItem.name);
    formData.append(`menuItems[${index}][price]`, (menuItem.price * 100).toString());
});


  if (formDataJson.imageFile) { // has the undefine possiblely
    formData.append(`imageFile`, formDataJson.imageFile);
  }

  onSave(formData);
};
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}

export default ManageRestaurantForm;
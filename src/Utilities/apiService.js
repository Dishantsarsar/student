import { API_ENDPOINTS } from "../Constant/apiconstant";

export const fetchAboutData = async () => {
  const response = await fetch(API_ENDPOINTS.ABOUT);

  if (!response.ok) {
    throw new Error("Failed to fetch about page data");
  }

  return response.json();
};

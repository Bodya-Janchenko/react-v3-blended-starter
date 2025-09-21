import axios from "axios";
import type { Photo, PhotoResponse } from "../types/photo";

const token = import.meta.env.VITE_API_KEY;
axios.defaults.baseURL = "https://api.pexels.com/v1/";
axios.defaults.headers.common["Authorization"] = token;
axios.defaults.params = {
  orientation: "landscape",
};

export const getPhotos = async (query: string): Promise<Photo[]> => {
  const response = await axios.get<PhotoResponse>(`search?query=${query}`);
  return response.data.photos;
};

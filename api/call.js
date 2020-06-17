import axios from "axios";
import apiKey from "../secrets";

export const callApi = async (input, page, perPage) => {
  let results = [];
  try {
    results = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${input}&image_type=photo&page=${page}&per_page=${perPage}`
    );
    return results.data;
  } catch (err) {
    if (err.request) {
      console.log(err.request.response);
    } else {
      console.log(err);
    }
  }
  return results;
};

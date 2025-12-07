import axios from 'axios';

const API_KEY = '53514821-85afacbf4adfab5c71570a964';
const BASE_URL = 'https://pixabay.com/api/';
const PAGE_SIZE = 15;

export async function getImagesByQuery(query, page) {
  try {
    const params = {
      key: API_KEY,
      q: query,
      page: page,
      per_page: PAGE_SIZE,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    };

    const res = await axios.get(BASE_URL, { params });
    return res.data;
  } catch (error) {
    console.error('API error');
  }
}

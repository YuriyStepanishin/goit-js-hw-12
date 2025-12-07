import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadBtn,
  hideLoadBtn,
  scrollGallery,
} from './js/render-functions';

const PAGE_SIZE = 15;
let query = '';
let page = 1;
let totalPages = 0;

const formEl = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.loadMore');

hideLoadBtn();

formEl.addEventListener('submit', async e => {
  e.preventDefault();

  const formData = new FormData(e.target);
  query = formData.get('search-text').trim();
  page = 1;

  if (!query) {
    iziToast.warning({
      message: 'Please enter a search word!',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  showLoader();

  try {
    const res = await getImagesByQuery(query, page);
    const { hits, totalHits } = res;

    if (!hits || hits.length === 0) {
      iziToast.info({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoadBtn();
      return;
    }

    createGallery(hits);

    totalPages = Math.ceil(totalHits / PAGE_SIZE);
    checkBtnStatus();
  } catch (error) {
    console.error(error);
    iziToast.error({
      message: 'Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    e.target.reset();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;

  showLoader();

  try {
    const res = await getImagesByQuery(query, page);
    const { hits } = res;

    if (!hits || hits.length === 0) {
      hideLoadBtn();
      return;
    }
    createGallery(hits);
    scrollGallery();
    checkBtnStatus();
  } catch (error) {
    console.error(error);
    iziToast.error({
      message: 'Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

function checkBtnStatus() {
  if (page < totalPages) {
    showLoadBtn();
  } else {
    hideLoadBtn();
    iziToast.info({
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
    });
  }
}

import { getImagesByQuery } from './js/pixabay-api.js';
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from './js/render-functions.js';

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const searchForm = document.querySelector('.form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more-btn');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
const perPage = 15;

function checkLoadMoreButton() {
    const loadedImages = currentPage * perPage;
    if (loadedImages < totalHits) {
        showLoadMoreButton();
    } else {
        hideLoadMoreButton();
        if (totalHits > 0) {
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
                position: 'topRight',
            });
        }
    }
}

async function onSearch(event) {
    event.preventDefault();
    const query = event.currentTarget.elements['search-text'].value.trim();
    if (query === '') {
        iziToast.error({
            message: 'Search field cannot be empty!',
            position: 'topRight',
        });
        return;
    }
    currentPage = 1;
    currentQuery = query;
    clearGallery();
    hideLoadMoreButton();
    showLoader();

    event.currentTarget.reset();
    
    try {
        const data = await getImagesByQuery(currentQuery, currentPage);
        totalHits = data.totalHits;
        
        if (data.hits.length === 0) {
            iziToast.error({
                title: 'Error',
                message: 'Sorry, there are no images matching your search query. Please try again!',
                position: 'topRight',
            });
        } else {
            createGallery(data.hits);
            checkLoadMoreButton();
        }

    } catch (error) {
        console.error(error);
        iziToast.error({
            title: 'Error',
            message: 'Failed to fetch images. Please check your network or API key.',
            position: 'topRight',
        });
    } finally {
        hideLoader();
        event.currentTarget.reset();
    }
}

async function onLoadMore() {
    currentPage += 1;
    showLoader();
    hideLoadMoreButton();
    try {
        const data = await getImagesByQuery(currentQuery, currentPage);
        createGallery(data.hits);
        checkLoadMoreButton();
        const firstGalleryItem = document.querySelector('.gallery-item');

        if (firstGalleryItem) {
            const itemHeight = firstGalleryItem.getBoundingClientRect().height;
            window.scrollBy({
                top: itemHeight * 2,
                behavior: 'smooth',
            })
        }
    }catch (error) {
        console.error(error);
        iziToast.error({
            title: 'Error',
            message: 'Failed to load more images.',
            position: 'topRight',
        });
        currentPage -= 1; 
        showLoadMoreButton();
    } finally {
        hideLoader();
    }
}


if (searchForm) {
    searchForm.addEventListener('submit', onSearch);
}

if (loadMoreButton) {
    loadMoreButton.addEventListener('click', onLoadMore);
}
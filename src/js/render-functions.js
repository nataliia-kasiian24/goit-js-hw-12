import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more-btn');

let lightbox;
if (galleryContainer) {
    lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
    });
}

export function showLoader() {
    if (loader) {
        loader.removeAttribute('hidden');
    }
}

export function hideLoader() {
    if (loader) {
        loader.setAttribute('hidden', true);
    }
}

export function showLoadMoreButton() {
    if (loadMoreButton) {
        loadMoreButton.removeAttribute('hidden');
    }
}

export function hideLoadMoreButton() {
    if (loadMoreButton) {
        loadMoreButton.setAttribute('hidden', true);
    }
}

export function createGallery(images) {
    if (!galleryContainer) return;

    const markup = images.map(image => {
        return `
            <li class="gallery-item">
                <a href="${image.largeImageURL}">
                    <img src="${image.webformatURL}" alt="${image.tags}">
                </a>
                <div class="info">
                    <p><b>Likes</b> ${image.likes}</p>
                    <p><b>Views</b> ${image.views}</p>
                    <p><b>Comments</b> ${image.comments}</p>
                    <p><b>Downloads</b> ${image.downloads}</p>
                </div>
            </li>
        `;
    }).join('');

    galleryContainer.insertAdjacentHTML('beforeend', markup);
    
    if (lightbox) {
        lightbox.refresh();
    }
        
}
export function clearGallery() {
    if (galleryContainer) {
        galleryContainer.innerHTML = '';
    }
}
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const API_URL_BASE = 'https://pixabay.com/api/';
const apiKey = '43897826-0f8632ff14c61d7f409caf77c';

const form = document.querySelector('#search-form');
const inputKeyWord = document.querySelector('input');
const galleryContainer = document.querySelector('.gallery');
    galleryContainer.style.display = 'flex';
    galleryContainer.style.flexDirection = 'row';
    galleryContainer.style.justifyContent = 'space-between';
    galleryContainer.style.gap = '25px';
    galleryContainer.style.alignItems = 'center';
    galleryContainer.style.flexWrap = 'wrap';
const searchButton = document.querySelector('button');
const loadMoreBtn = document.querySelector('.load-more');
searchButton.disabled = true;
inputKeyWord.addEventListener('input', () => {
  searchButton.disabled = false;
});


const lightbox = () =>
  new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

function getPhotos(hits) {
  const markup = hits
    .map(item => {
      return `
       <div class="photo-card">
          <a href="${item.largeImageURL}"> 
            <img src="${item.webformatURL}" alt="${item.tags}" />
          </a>
          <div class="info">
            <p class="info-item">
              <p> <b> Likes </b> </br> ${item.likes}</p>
            </p>
            <p class="info-item">
              <p> <b>Views</b> </br> ${item.views}</p>
            </p>
            <p class="info-item">
              <p> <b> Comments</b></br>${item.comments}</p>
            </p>
            <p class="info-item">
              <p> <b> Downloads</b></br>${item.downloads}</p>
            </p>
          </div>
        </div>`;
    })
    .join('');
  galleryContainer.insertAdjacentHTML('beforeend', markup);
}

let page = 1;
let searchText = null;
async function searchImages() {
  searchText = inputKeyWord.value.trim();
  if (searchText === '') {
    Notiflix.Notify.warning('Please enter a search term.');
    return;
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: searchText,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 40,
  });

  try {
    const response = await axios.get(API_URL_BASE, { params });
    console.log(response.data)
    
    if (response.data.hits.length === 0) {
      
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.style.display = 'none';
    } else {
      
        Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
      getPhotos(response.data.hits);
      lightbox();
      if (response.data.hits.length < 40) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
      }
    }
  } catch (err) {
    console.log(err);
  }
}

function numberOfImages(totalHits) {
  if (page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images. Blaaa`);
  }
  return;
}

searchButton.addEventListener('click', e => {
  e.preventDefault();

  page = 1;
  galleryContainer.innerHTML = '';
  searchImages();
});






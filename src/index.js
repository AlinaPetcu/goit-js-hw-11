import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const baseUrl = 'https://pixabay.com/api/';
const API_KEY = '43897826-0f8632ff14c61d7f409caf77c';
const variable = {
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 1,
    q: '',
  },
};

const formInput = document.querySelector('.search-form');
const photosGallery = document.querySelector('.gallery');
const moreButton = document.querySelector('.load-more');

moreButton.style.display = 'none';

const lightbox = () =>
  new SimpleLightbox('.photo-card a', {
    //captionsData: 'alt',
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
  photosGallery.insertAdjacentHTML('beforeend', markup);
}

async function onSubmit(e) {
  e.preventDefault();
  const form = e.target;
  variable.params.q = form.elements.searchQuery.value;
  if (variable.params.q === '') {
    Notify.info('Fill in the search input!');
    photosGallery.innerHTML = '';
    return;
  }

  variable.params.page = 1;
  photosGallery.innerHTML = '';

  try {
    const response = await axios.get(baseUrl, variable);
    const totalHits = response.data.totalHits;
    const hits = response.data.hits;
    if (hits.length === 0) {
      moreButton.style.display = 'none';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      getPhotos(hits);
      lightbox();
      moreButton.style.display = 'block';
    }
  } catch (err) {
    console.log(err);
  }
}

async function getMorePhotos() {
  variable.params.page += 1;
  try {
    const response = await axios.get(baseUrl, variable);
    const hits = response.data.hits;
    const totalHits = response.data.totalHits;
    getPhotos(hits);
    if (variable.params.page * variable.params.per_page >= totalHits) {
      moreButton.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (err) {
    console.log(err);
  }
}

formInput.addEventListener('submit', onSubmit);
moreButton.addEventListener('click', getMorePhotos);

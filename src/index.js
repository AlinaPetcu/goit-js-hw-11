import Notiflix from 'notiflix';
import axios from 'axios';
import simpleLightbox from 'simplelightbox';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.style.display = 'none';
const myKey = '43897826-0f8632ff14c61d7f409caf77c';
const url = 'https://pixabay.com/api/';

let page = 1;

async function searchImages() {
  const searchValue = input.value.trim();
  if (searchValue === '') {
    Notiflix.Notify.warning('Please enter a search term.');
    return;
  }

  const params = new URLSearchParams({
    key: myKey,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 40,
  });

  try {
    const response = await axios.get(url, { params });
    foundImagesNumber(response.data.total);
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.style.display = 'none';
    } else {
      displayResult(response.data.hits);
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

function foundImagesNumber(totalHits) {
  if (page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  return;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  page = 1;
  gallery.innerHTML = '';
  searchImages();
});

function displayResult(images) {
  const markup = images
    .map(image => {
      return `
     <li class="list">
     <a href="${image.largeImageURL}" class="photo-link">
          <img class="picture" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p><b>Likes:</b>${image.likes}</p>
          <p><b>Views:</b>${image.views}</p>
          <p><b>Comments:</b>${image.comments}</p>
          <p><b>Downloads:</b>${image.downloads}</p>
        </div></li>
      
     
    `;
    })
    .join('');
  gallery.innerHTML += markup;
  new simpleLightbox('.gallery a');
}

loadMoreBtn.addEventListener('click', e => {
  e.preventDefault();
  page++;
  window.addEventListener('scroll', e => {
    e.preventDefault();
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 1000
    ) {
      page++;
      searchImages();
      console.log('load more');
    }
  });
  searchImages();
});





// import Notiflix from 'notiflix';
// import axios from 'axios';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// const API_URL_BASE = 'https://pixabay.com/api/';
// const apiKey = '43897826-0f8632ff14c61d7f409caf77c';

// const form = document.querySelector('#search-form');
// const inputKeyWord = document.querySelector('input');
// const galleryContainer = document.querySelector('.gallery');
//     galleryContainer.style.display = 'flex';
//     galleryContainer.style.flexDirection = 'row';
//     galleryContainer.style.justifyContent = 'space-between';
//     galleryContainer.style.gap = '25px';
//     galleryContainer.style.alignItems = 'center';
//     galleryContainer.style.flexWrap = 'wrap';
// const searchButton = document.querySelector('button');
// const loadMoreBtn = document.querySelector('.load-more');
//  loadMoreBtn.disabled = true;
// loadMoreBtn.style.display = 'none';
// inputKeyWord.addEventListener('input', () => {
//   searchButton.disabled = false;

// });




// const lightbox = () =>
//   new SimpleLightbox('.photo-card a', {
//    // captionsData: 'alt',
//     captionDelay: 250,
//   });

// function getPhotos(hits) {
//   const markup = hits
//     .map(item => {
//       return `
//        <div class="photo-card">
//           <a href="${item.largeImageURL}"> 
//             <img src="${item.webformatURL}" alt="${item.tags}" />
//           </a>
//           <div class="info">
//             <p class="info-item">
//               <p> <b> Likes </b> </br> ${item.likes}</p>
//             </p>
//             <p class="info-item">
//               <p> <b>Views</b> </br> ${item.views}</p>
//             </p>
//             <p class="info-item">
//               <p> <b> Comments</b></br>${item.comments}</p>
//             </p>
//             <p class="info-item">
//               <p> <b> Downloads</b></br>${item.downloads}</p>
//             </p>
//           </div>
//         </div>`;
//     })
//     .join('');
//   galleryContainer.insertAdjacentHTML('beforeend', markup);
// }

// let page = 1;
// let searchText = null;

 
// async function searchImages() {
//   searchText = inputKeyWord.value.trim();
//   if (searchText === '') {
//     Notiflix.Notify.warning('Please enter a search term.');
//     return;
//   }

//  const params = new URLSearchParams({
//     key: apiKey,
//     q: searchText,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: 'true',
//     page: page,
//     per_page: 40,
//   });

//   try {
//     const response = await axios.get(API_URL_BASE, { params });
//     console.log(response.data)
    
//     if (response.data.hits.length === 0) {
      
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//       loadMoreBtn.style.display = 'none';
//     } else {
      
//         Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
//       getPhotos(response.data.hits);
//       lightbox();
//       if (response.data.hits.length < 40) {
//         loadMoreBtn.style.display = 'none';
//       } else {
//         loadMoreBtn.style.display = 'block';
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

// function numberOfImages(totalHits) {
//   if (page === 1) {
//     Notiflix.Notify.success(`Hooray! We found ${totalHits} images. Blaaa`);
//   }
//   return;
// }

// searchButton.addEventListener('click', e => {
//   e.preventDefault();

//   page = 1;
//   galleryContainer.innerHTML = '';
//   searchImages();
// });

// // async function getMorePhotos() {
 
// //   const paramsMore = new URLSearchParams({
// //     key: apiKey,
// //     q: searchText,
// //     image_type: 'photo',
// //     orientation: 'horizontal',
// //     safesearch: 'true',
// //     page: page,
// //     per_page: 40,
// //   });
// //    params.page += 1;
// //   try {
// //     const response = await axios.get(API_URL_BASE, { paramsMore });
// //     const hits = response.data.hits;
// //     const totalHits = response.data.totalHits;
// //     searchImages(response.data.hits);
// //     if (paramsMore.page * paramsMore.per_page >= totalHits) {
// //       loadMoreBtn.style.display = 'none';
// //       Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
// //     }
// //   } catch (err) {
// //     console.log(err);
// //   }
// // }

// window.addEventListener(
//   "scroll",
//   _.debounce(() => {
//     const scrolledTo = window.scrollY + window.innerHeight;

//     const isReachBottom = document.body.scrollHeight <= scrolledTo;

//     if (isReachBottom) {
//       searchImages();
//     }
//   }, 300)
// );


// //loadMoreBtn.addEventListener('click', getMorePhotos);







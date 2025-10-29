(function () {
  function createThumb(photo) {
    var article = document.createElement('article');
    article.className = 'thumb';

    var link = document.createElement('a');
    link.href = photo.url;
    link.className = 'image';

    var image = document.createElement('img');
    image.src = photo.url;
    image.alt = photo.title;
    link.appendChild(image);

    var heading = document.createElement('h2');
    heading.textContent = photo.title;

    article.appendChild(link);
    article.appendChild(heading);

    if (photo.description) {
      var description = document.createElement('p');
      description.textContent = photo.description;
      article.appendChild(description);
    }

    return article;
  }

  function renderGallery(photos) {
    var container = document.getElementById('gallery');
    if (!container) {
      return;
    }

    container.innerHTML = '';

    photos.forEach(function (photo) {
      container.appendChild(createThumb(photo));
    });
  }

  function showError(message) {
    var container = document.getElementById('gallery');
    if (!container) {
      return;
    }
    container.innerHTML = '';
    var alert = document.createElement('p');
    alert.textContent = message;
    alert.style.color = '#ff6f61';
    container.appendChild(alert);
  }

  function loadGallery() {
    fetch('/api/photos')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Unable to load gallery');
        }
        return response.json();
      })
      .then(function (photos) {
        photos.sort(function (a, b) {
          if (a.displayOrder === b.displayOrder) {
            return a.title.localeCompare(b.title);
          }
          return a.displayOrder - b.displayOrder;
        });
        renderGallery(photos);
      })
      .catch(function (error) {
        console.error(error);
        showError('Failed to load gallery images. Please try again later.');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGallery);
  } else {
    loadGallery();
  }
})();

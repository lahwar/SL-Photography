const API_BASE = '/api';
const messageEl = document.getElementById('message');
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const loginForm = document.getElementById('login-form');
const uploadForm = document.getElementById('upload-form');
const editForm = document.getElementById('edit-form');
const cancelEditButton = document.getElementById('cancel-edit');
const logoutButton = document.getElementById('logout');
const photoList = document.getElementById('photo-list');

function getToken() {
  return localStorage.getItem('slp-token');
}

function setToken(token) {
  if (token) {
    localStorage.setItem('slp-token', token);
  } else {
    localStorage.removeItem('slp-token');
  }
}

function authHeaders(headers = {}) {
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function showMessage(message, type = 'info') {
  if (!message) {
    messageEl.textContent = '';
    messageEl.className = '';
    return;
  }

  messageEl.textContent = message;
  messageEl.className = type;
}

function toggleAuthUI(isAuthenticated) {
  if (isAuthenticated) {
    loginSection.classList.add('hidden');
    adminSection.classList.remove('hidden');
    logoutButton.style.display = 'inline-block';
  } else {
    adminSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    logoutButton.style.display = 'none';
  }
}

async function handleResponse(response) {
  if (response.status === 401) {
    setToken(null);
    toggleAuthUI(false);
    throw new Error('Authentication required. Please sign in again.');
  }

  if (!response.ok) {
    const message = await response.json().catch(() => ({}));
    throw new Error(message.message || 'Unexpected error');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function createPhotoListItem(photo) {
  const li = document.createElement('li');
  li.draggable = true;
  li.dataset.id = photo.id;

  const thumbnail = document.createElement('img');
  thumbnail.src = photo.url;
  thumbnail.alt = photo.title;

  const info = document.createElement('span');
  info.textContent = `${photo.displayOrder}. ${photo.title}`;

  const buttons = document.createElement('div');
  buttons.className = 'actions';

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'secondary';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => startEdit(photo));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deletePhoto(photo.id));

  buttons.appendChild(editButton);
  buttons.appendChild(deleteButton);

  li.appendChild(thumbnail);
  li.appendChild(info);
  li.appendChild(buttons);

  li.addEventListener('dragstart', () => {
    li.classList.add('dragging');
  });

  li.addEventListener('dragend', () => {
    li.classList.remove('dragging');
    persistReorder();
  });

  return li;
}

async function fetchPhotos() {
  try {
    const response = await fetch(`${API_BASE}/photos`);
    const photos = await handleResponse(response);
    renderPhotos(photos);
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

function renderPhotos(photos) {
  photoList.innerHTML = '';
  photos.forEach((photo) => {
    photoList.appendChild(createPhotoListItem(photo));
  });
}

function getCurrentOrder() {
  return Array.from(photoList.children).map((item) => item.dataset.id);
}

async function persistReorder() {
  const order = getCurrentOrder();
  if (!order.length) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/photos/reorder`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ order })
    });

    const updated = await handleResponse(response);
    renderPhotos(updated);
    showMessage('Photo order updated.', 'success');
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

function startEdit(photo) {
  editForm.classList.remove('hidden');
  editForm.reset();
  document.getElementById('edit-id').value = photo.id;
  document.getElementById('edit-title').value = photo.title;
  document.getElementById('edit-description').value = photo.description || '';
  document.getElementById('edit-display-order').value = photo.displayOrder || '';
  document.getElementById('edit-filename').value = photo.filename || '';
  showMessage(`Editing “${photo.title}”`, 'info');
}

async function deletePhoto(id) {
  if (!confirm('Delete this photo?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/photos/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });

    await handleResponse(response);
    showMessage('Photo deleted.', 'success');
    await fetchPhotos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    const result = await handleResponse(response);
    setToken(result.token);
    toggleAuthUI(true);
    showMessage('Signed in successfully.', 'success');
    await fetchPhotos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(uploadForm);

  if (!formData.get('file') && !formData.get('filename')) {
    showMessage('Provide an image file or an existing filename.', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/photos`, {
      method: 'POST',
      headers: authHeaders(),
      body: formData
    });

    await handleResponse(response);
    uploadForm.reset();
    showMessage('Photo added.', 'success');
    await fetchPhotos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

editForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('edit-id').value;
  if (!id) {
    showMessage('Select a photo first.', 'error');
    return;
  }

  const formData = new FormData(editForm);
  formData.delete('id');

  try {
    const response = await fetch(`${API_BASE}/photos/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: formData
    });

    await handleResponse(response);
    editForm.reset();
    editForm.classList.add('hidden');
    showMessage('Photo updated.', 'success');
    await fetchPhotos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

cancelEditButton.addEventListener('click', () => {
  editForm.reset();
  editForm.classList.add('hidden');
  showMessage('Edit cancelled.', 'info');
});

photoList.addEventListener('dragover', (event) => {
  event.preventDefault();
  const dragging = photoList.querySelector('.dragging');
  if (!dragging) {
    return;
  }

  const afterElement = getDragAfterElement(event.clientY);
  if (!afterElement) {
    photoList.appendChild(dragging);
  } else {
    photoList.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(y) {
  const draggableElements = [...photoList.querySelectorAll('li:not(.dragging)')];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}

logoutButton.addEventListener('click', () => {
  setToken(null);
  toggleAuthUI(false);
  showMessage('Signed out.', 'info');
});

(function init() {
  if (getToken()) {
    toggleAuthUI(true);
    fetchPhotos();
  } else {
    toggleAuthUI(false);
  }
})();

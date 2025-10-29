const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const { randomUUID } = require('crypto');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';
const DATA_PATH = path.join(__dirname, '..', 'data', 'photos.json');
const IMAGES_DIR = path.join(__dirname, '..', 'images', 'fulls');

const app = express();
const activeTokens = new Set();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/\s+/g, '-');
    cb(null, `${timestamp}-${sanitized}`);
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));
app.use(express.static(path.join(__dirname, '..')));

async function ensureDataFile() {
  try {
    await fs.access(DATA_PATH);
  } catch (error) {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, '[]', 'utf8');
  }
}

async function loadPhotos() {
  await ensureDataFile();
  const data = await fs.readFile(DATA_PATH, 'utf8');
  if (!data.trim()) {
    return [];
  }
  return JSON.parse(data);
}

async function savePhotos(photos) {
  await fs.writeFile(DATA_PATH, JSON.stringify(photos, null, 2));
}

function sortPhotos(photos) {
  return [...photos].sort((a, b) => {
    if (a.displayOrder === b.displayOrder) {
      return a.title.localeCompare(b.title);
    }
    return a.displayOrder - b.displayOrder;
  });
}

function formatPhoto(photo) {
  return {
    ...photo,
    url: `/images/fulls/${photo.filename}`
  };
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing authentication token' });
  }

  const token = authHeader.substring('Bearer '.length);
  if (!activeTokens.has(token)) {
    return res.status(401).json({ message: 'Invalid authentication token' });
  }

  return next();
}

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = randomUUID();
  activeTokens.add(token);
  res.json({ token });
});

app.get('/api/photos', async (req, res, next) => {
  try {
    const photos = await loadPhotos();
    const sorted = sortPhotos(photos);
    res.json(sorted.map(formatPhoto));
  } catch (error) {
    next(error);
  }
});

app.post('/api/photos', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    const { title, description = '', filename: providedFilename } = req.body;
    let filename = providedFilename;

    if (req.file) {
      filename = req.file.filename;
    }

    if (!title || !filename) {
      if (req.file) {
        await fs.unlink(path.join(IMAGES_DIR, req.file.filename)).catch(() => undefined);
      }
      return res.status(400).json({ message: 'Title and filename are required' });
    }

    const photos = await loadPhotos();
    const maxOrder = photos.reduce((acc, item) => Math.max(acc, item.displayOrder || 0), 0);
    const newPhoto = {
      id: randomUUID(),
      title,
      description,
      filename,
      displayOrder: maxOrder + 1
    };

    photos.push(newPhoto);
    await savePhotos(photos);

    res.status(201).json(formatPhoto(newPhoto));
  } catch (error) {
    next(error);
  }
});

app.patch('/api/photos/:id', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, filename: providedFilename, displayOrder } = req.body;
    const photos = await loadPhotos();
    const index = photos.findIndex((item) => item.id === id);

    if (index === -1) {
      if (req.file) {
        await fs.unlink(path.join(IMAGES_DIR, req.file.filename)).catch(() => undefined);
      }
      return res.status(404).json({ message: 'Photo not found' });
    }

    let filename = photos[index].filename;
    if (req.file) {
      filename = req.file.filename;
    } else if (providedFilename) {
      filename = providedFilename;
    }

    if (title) {
      photos[index].title = title;
    }

    if (typeof description === 'string') {
      photos[index].description = description;
    }

    if (filename) {
      photos[index].filename = filename;
    }

    if (displayOrder !== undefined && displayOrder !== null && displayOrder !== '') {
      const orderNumber = Number(displayOrder);
      if (!Number.isNaN(orderNumber)) {
        photos[index].displayOrder = orderNumber;
      }
    }

    await savePhotos(photos);
    res.json(formatPhoto(photos[index]));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/photos/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const photos = await loadPhotos();
    const index = photos.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const [removed] = photos.splice(index, 1);
    await savePhotos(photos);

    res.json({ message: 'Photo removed', photo: formatPhoto(removed) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/photos/reorder', authenticate, async (req, res, next) => {
  try {
    const { order } = req.body || {};
    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: 'Order must be a non-empty array of photo IDs' });
    }

    const photos = await loadPhotos();
    const ids = new Set(photos.map((photo) => photo.id));
    if (!order.every((id) => ids.has(id))) {
      return res.status(400).json({ message: 'Order contains unknown photo IDs' });
    }

    const updated = photos.map((photo) => ({ ...photo }));
    order.forEach((id, index) => {
      const photo = updated.find((item) => item.id === id);
      if (photo) {
        photo.displayOrder = index + 1;
      }
    });

    const remaining = updated.filter((item) => !order.includes(item.id));
    if (remaining.length > 0) {
      const start = order.length + 1;
      remaining
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .forEach((photo, idx) => {
          photo.displayOrder = start + idx;
        });
    }

    await savePhotos(updated);
    res.json(sortPhotos(updated).map(formatPhoto));
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

ensureDataFile()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize data file', error);
    process.exit(1);
  });

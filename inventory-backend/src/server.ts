import express, { type Request, type Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

interface InventoryItem {
  id: number;
  inventory_name: string;
  description: string;
  photo: string | null;
}

let inventory: InventoryItem[] = [];
let nextId = 1;

// 1. Отримати весь інвентар (GET /inventory)
app.get('/inventory', (req: Request, res: Response) => {
  res.json(inventory);
});

// 2. Отримати один елемент (GET /inventory/:id)
app.get('/inventory/:id', (req: Request, res: Response): any => {
  const item = inventory.find((i) => i.id === parseInt(req.params.id as string));
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

// 3. Створити новий інвентар (POST /register)
app.post('/register', upload.single('photo'), (req: Request, res: Response): any => {
  const { inventory_name, description } = req.body;

  if (!inventory_name) {
    return res.status(400).json({ message: 'Inventory name is required' });
  }

  const newItem: InventoryItem = {
    id: nextId++,
    inventory_name,
    description: description || '',
    photo: req.file ? `/uploads/${req.file.filename}` : null,
  };

  inventory.push(newItem);
  res.status(201).json(newItem);
});

// 4. Оновити текстові дані (PUT /inventory/:id)
app.put('/inventory/:id', (req: Request, res: Response): any => {
  const { inventory_name, description } = req.body;
  const item = inventory.find((i) => i.id === parseInt(req.params.id as string));

  if (!item) return res.status(404).json({ message: 'Not found' });

  if (inventory_name) item.inventory_name = inventory_name;
  if (description !== undefined) item.description = description;

  res.json(item);
});

// 5. Оновити тільки фото (PUT /inventory/:id/photo)
app.put('/inventory/:id/photo', upload.single('photo'), (req: Request, res: Response): any => {
  const item = inventory.find((i) => i.id === parseInt(req.params.id as string));
  if (!item) return res.status(404).json({ message: 'Not found' });

  if (req.file) {
    if (item.photo) {
      const oldPath = path.join(__dirname, '..', item.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    item.photo = `/uploads/${req.file.filename}`;
  }

  res.json(item);
});

// 6. Видалити інвентар (DELETE /inventory/:id)
app.delete('/inventory/:id', (req: Request, res: Response): any => {
  const id = parseInt(req.params.id as string);
  const index = inventory.findIndex((i) => i.id === id);

  if (index === -1) return res.status(404).json({ message: 'Not found' });

  const itemToDelete = inventory[index];

  if (itemToDelete && itemToDelete.photo) {
    const photoPath = path.join(__dirname, '..', itemToDelete.photo);
    if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
  }

  inventory.splice(index, 1);
  res.json({ message: 'Successfully deleted' });
});

app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});

import express from 'express';
import { mockDb } from './mockDb.js';
import { validatePayload, validateHealthCheckShape } from './validator.js';

const router = express.Router();

// Structural health check route validating exact incoming request bodies
router.post('/health', validateHealthCheckShape, (req, res) => {
  res.status(200).json({ status: 'ok', message: 'System health validated', timestamp: new Date().toISOString() });
});

// CRUD Operations

// Get all items
router.get('/items', async (req, res) => {
  try {
    const items = await mockDb.getAll();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error while fetching items.' });
  }
});

// Get single item
router.get('/items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await mockDb.getById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Create new item with validation
router.post('/items', validatePayload, async (req, res) => {
  try {
    const newItem = await mockDb.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error during creation.' });
  }
});

// Update item with validation
router.put('/items/:id', validatePayload, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedItem = await mockDb.update(id, req.body);
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found to update.' });
    }
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error during update.' });
  }
});

// Delete item
router.delete('/items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const success = await mockDb.delete(id);
    if (!success) {
      return res.status(404).json({ error: 'Item not found to delete.' });
    }
    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error during deletion.' });
  }
});

export default router;

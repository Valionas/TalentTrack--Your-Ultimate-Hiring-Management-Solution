import express from 'express';
import {
  getMessages,
  getMessageDetails,
  getMessagesByReceiver,
  createMessage,
  updateMessage,
  deleteMessage,
} from '../controllers/messageController';
import { authProtection } from '../middlewares/authMiddleware';

const router = express.Router();

// Get all messages (if needed)
router.get('/', authProtection, getMessages);

// Get messages for a specific receiver
router.get('/receiver/:receiver', authProtection, getMessagesByReceiver);

// Get message details by ID
router.get('/:id', authProtection, getMessageDetails);

// Create a new message
router.post('/', authProtection, createMessage);

// Update a message by ID
router.put('/:id', authProtection, updateMessage);

// Delete a message by ID
router.delete('/:id', authProtection, deleteMessage);

export default router;

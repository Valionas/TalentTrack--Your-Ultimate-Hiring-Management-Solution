import express from 'express';
import {
  getMessages,
  getMessageDetails,
  getMessagesByReceiver,
  createMessage,
  updateMessage,
  deleteMessage,
} from '../controllers/messageController';

const router = express.Router();

// Get all messages (if needed)
router.get('/', getMessages);

// Get messages for a specific receiver
router.get('/receiver/:receiver', getMessagesByReceiver);

// Get message details by ID
router.get('/:id', getMessageDetails);

// Create a new message
router.post('/', createMessage);

// Update a message by ID
router.put('/:id', updateMessage);

// Delete a message by ID
router.delete('/:id', deleteMessage);

export default router;

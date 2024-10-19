import express from 'express';
import { getAllUsers, getUserProfile, updateUserProfile } from '../controllers/userController';
import { authProtection } from '../middlewares/authMiddleware';

const router = express.Router();

// Route to update the user profile, protected by 'authProtection' middleware
router.get('/profile', authProtection, getUserProfile);
router.put('/profile', authProtection, updateUserProfile);
router.get('/', authProtection, getAllUsers);
export default router;

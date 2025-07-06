import express from 'express';
import { getJobs, getJobDetails, createJob, updateJob, deleteJob } from '../controllers/jobController';
import { authProtection } from '../middlewares/authMiddleware';

const router = express.Router();

// Define routes
router.get('/',  getJobs);
router.get('/:id', getJobDetails);
router.post('/', authProtection, createJob);
router.put('/:id', authProtection, updateJob);
router.delete('/:id', authProtection, deleteJob);

export default router;
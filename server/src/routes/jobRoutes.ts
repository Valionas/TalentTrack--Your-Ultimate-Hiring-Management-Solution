import express from 'express';
import { getJobs, getJobDetails, createJob, updateJob, deleteJob } from '../controllers/jobController';

const router = express.Router();

// Define routes
router.get('/', getJobs);
router.get('/:id', getJobDetails);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
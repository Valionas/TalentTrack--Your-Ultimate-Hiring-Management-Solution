import { Request, Response } from 'express';
import JobModel, { Job } from '../models/Job';

// Get all jobs
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await JobModel.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve jobs', error });
  }
};

// Get job details by ID
export const getJobDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve job details', error });
  }
};

// Create a new job
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = new JobModel(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', error });
  }
};

// Update a job by ID
export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await JobModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job', error });
  }
};

// Delete a job by ID
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await JobModel.findByIdAndDelete(req.params.id);
    if (job) {
      res.status(200).json({ message: 'Job deleted successfully' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job', error });
  }
};

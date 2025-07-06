// routes/contractRoutes.ts
import express from 'express';
import {
  getAllContracts,
  getContractDetails,
  createContract,
  updateContract,
  deleteContract,
} from '../controllers/contractController';
import { authProtection } from '../middlewares/authMiddleware';

const router = express.Router();

// Define routes
router.get('/', authProtection, getAllContracts);             // GET /contracts
router.get('/:id', authProtection, getContractDetails);       // GET /contracts/:id
router.post('/', authProtection, createContract);             // POST /contracts
router.put('/:id', authProtection, updateContract);           // PUT /contracts/:id
router.delete('/:id', authProtection, deleteContract);        // DELETE /contracts/:id

export default router;

// routes/contractRoutes.ts
import express from 'express';
import {
  getAllContracts,
  getContractDetails,
  createContract,
  updateContract,
  deleteContract,
} from '../controllers/contractController';

const router = express.Router();

// Define routes
router.get('/', getAllContracts);             // GET /contracts
router.get('/:id', getContractDetails);       // GET /contracts/:id
router.post('/', createContract);             // POST /contracts
router.put('/:id', updateContract);           // PUT /contracts/:id
router.delete('/:id', deleteContract);        // DELETE /contracts/:id

export default router;

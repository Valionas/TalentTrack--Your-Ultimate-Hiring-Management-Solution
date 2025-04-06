// controllers/contractController.ts
import { Request, Response } from 'express';
import ContractModel, { Contract } from '../models/Contract';

// Get all contracts
export const getAllContracts = async (req: Request, res: Response): Promise<void> => {
  try {
    const contracts = await ContractModel.find();
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve contracts', error });
  }
};

// Get contract details by ID
export const getContractDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const contract = await ContractModel.findById(req.params.id);
    if (contract) {
      res.status(200).json(contract);
    } else {
      res.status(404).json({ message: 'Contract not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve contract details', error });
  }
};

// Create a new contract
export const createContract = async (req: Request, res: Response): Promise<void> => {
  try {
    const contract = new ContractModel(req.body);
    await contract.save();
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create contract', error });
  }
};

// Update a contract by ID
export const updateContract = async (req: Request, res: Response): Promise<void> => {
  try {
    const contract = await ContractModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (contract) {
      res.status(200).json(contract);
    } else {
      res.status(404).json({ message: 'Contract not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update contract', error });
  }
};

// Delete a contract by ID
export const deleteContract = async (req: Request, res: Response): Promise<void> => {
  try {
    const contract = await ContractModel.findByIdAndDelete(req.params.id);
    if (contract) {
      res.status(200).json({ message: 'Contract deleted successfully' });
    } else {
      res.status(404).json({ message: 'Contract not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contract', error });
  }
};

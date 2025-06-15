// src/controllers/userController.ts
import { Request, Response, RequestHandler } from 'express';
import User, { Rating } from '../models/User';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// 1) Update own profile
export const updateUserProfile: RequestHandler = async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const {
    firstName,
    lastName,
    age,
    industry,
    country,
    language,
    phone,
    address,
    skills,
    avatar,
    workExperience,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName      = firstName      ?? user.firstName;
    user.lastName       = lastName       ?? user.lastName;
    user.age            = age            ?? user.age;
    user.industry       = industry       ?? user.industry;
    user.country        = country        ?? user.country;
    user.language       = language       ?? user.language;
    user.phone          = phone          ?? user.phone;
    user.address        = address        ?? user.address;
    user.skills         = skills         ?? user.skills;
    user.avatar         = avatar         ?? user.avatar;
    user.workExperience = workExperience ?? user.workExperience;
    // leave user.ratings intact

    const updated = await user.save();
    const safe = updated.toObject();
    delete (safe as any).password;
    delete (safe as any).safeCode;

    res.json({ message: 'Profile updated successfully', user: safe });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// 2) Get own profile
export const getUserProfile: RequestHandler = async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// 3) List all users
export const getAllUsers: RequestHandler = async (_req, res) => {
  try {
    const users = await User.find().select('-password');
    const filtered = users.filter(u => u.firstName?.trim());
    if (filtered.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.json(filtered);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// 4) Rate another user (returns updated user with ratings only)
export const rateUser: RequestHandler = async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const raterId = authReq.user?.id;
  const targetId = req.params.id;
  const { grade } = req.body;

  if (!raterId) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  if (typeof grade !== 'number' || grade < 0 || grade > 5) {
    return res.status(400).json({ message: 'Grade must be between 0 and 5' });
  }

  try {
    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Remove any prior rating by this rater, then push the new grade
    user.ratings = user.ratings.filter(r => r.raterId !== raterId);
    user.ratings.push({ raterId, grade } as Rating);

    const updated = await user.save();
    const out = updated.toObject();
    delete (out as any).password;
    delete (out as any).safeCode;

    // Front-end will compute average from out.ratings
    res.json({ user: out });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

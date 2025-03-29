import { Request, Response } from 'express';
import User from '../models/User';

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;

  // Destructure new fields from the request body
  const { firstName, lastName, age, industry, country, language, phone, address, skills, avatar, workExperience } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update profile fields with new firstName and lastName
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.age = age || user.age;
    user.industry = industry || user.industry;
    user.country = country || user.country;
    user.language = language || user.language;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.skills = skills || user.skills;
    user.avatar = avatar || user.avatar;
    user.workExperience = workExperience || user.workExperience;

    const updatedUser = await user.save();

    // Exclude password from the response
    const { password, ...updatedUserWithoutPassword } = updatedUser.toObject();

    res.json({
      message: 'Profile updated successfully',
      user: updatedUserWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;

  try {
    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      age: user.age,
      country: user.country,
      industry: user.industry,
      skills: user.skills,
      phone: user.phone,
      address: user.address,
      language: user.language,
      workExperience: user.workExperience,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find all users and exclude the password field
    const users = await User.find().select('-password');

    // Filter out users who don't have a firstName field or have an empty firstName
    const filteredUsers = users.filter((user) => user.firstName && user.firstName.trim() !== '');

    if (!filteredUsers || filteredUsers.length === 0) {
      res.status(404).json({ message: 'No users found' });
      return;
    }

    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

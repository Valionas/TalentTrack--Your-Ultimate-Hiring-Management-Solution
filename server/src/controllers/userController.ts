import { Request, Response } from 'express';
import User from '../models/User';

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;

  const { name, age, industry, country, language, phone, address, skills, avatar, workExperience } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update profile fields
    user.name = name || user.name;
    user.age = age || user.age;
    user.industry = industry || user.industry;
    user.country = country || user.country;
    user.language = language || user.language;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.skills = skills || user.skills;
    user.avatar = avatar || user.avatar;
    user.workExperience = workExperience || user.workExperience;
    console.log(user.avatar);
    const updatedUser = await user.save();

    // Exclude password from the response
    const { password, ...updatedUserWithoutPassword } = updatedUser.toObject();

    res.json({
      message: 'Profile updated successfully',
      user: updatedUserWithoutPassword, // Exclude password here
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
      name: user.name,
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

    // Filter out users who don't have a name field or have an empty name
    const filteredUsers = users.filter((user) => user.name && user.name.trim() !== '');

    if (!filteredUsers || filteredUsers.length === 0) {
      res.status(404).json({ message: 'No users found' });
      return;
    }

    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};


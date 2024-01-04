// src/controllers/UserController.ts
import { Request, Response } from 'express';
import axios from 'axios';
import User from '../models/User';

class UserController {
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async addUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async editUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;

    try {
      const updatedUser = await User.update(req.body, {
        where: { id: userId },
      });

      if (updatedUser[0] === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ message: 'User updated successfully' });
      }
    } catch (error) {
      console.error('Error editing user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;

    try {
      const deletedUserCount = await User.destroy({
        where: { id: userId },
      });

      if (deletedUserCount === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ message: 'User deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new UserController();

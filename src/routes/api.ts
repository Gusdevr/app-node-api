import { Router, Request, Response } from "express";
import userController from '../controllers/UserController'; 

const router = Router();



router.get('/users', userController.getUsers);
router.post('/users', userController.addUser);
router.put('/users/:id', userController.editUser);
router.delete('/users/:id', userController.deleteUser);

router.post('/users/csv', userController.exportToCSV);

export default router;

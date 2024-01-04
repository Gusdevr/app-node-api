
import { Router } from "express";
import userController from '../controllers/UserController'; 

const router = Router();

router.get('/users', userController.getUsers);
router.post('/users', userController.addUser);
router.put('/users/:id', userController.editUser);
router.delete('/users/:id', userController.deleteUser);

export default router;

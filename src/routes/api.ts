// src/routes/api.ts
import { Router } from "express"
import  express from 'express';
import * as UserController from '../controllers/UserController';

const router = express.Router();

router.get('/users', UserController.getUsers);
router.post('/users', UserController.addUser);
router.put('/users/:id', UserController.editUser);
router.delete('/users/:id', UserController.deleteUser);

// Adicione rotas para adicionar, editar, excluir usuários conforme necessário

export default router;

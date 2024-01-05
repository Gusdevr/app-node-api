import { Request, Response } from 'express';
import axios from 'axios';
import User from '../models/User';
import fs from 'fs';
import path from 'path';
import { createObjectCsvStringifier } from 'csv-writer';

class UserController {
    public async exportToCSV(req: Request, res: Response): Promise<void> {
        try {
         
            const usersBeforeExport = await User.findAll();

         
            const csvFilePath = path.join(__dirname, '..', 'data', 'users.csv');

       
            const csvStringifier = createObjectCsvStringifier({
                header: [
                    { id: 'id', title: 'ID' },
                    { id: 'first_name', title: 'Name' },
                    { id: 'email', title: 'Email' },
                ],
            });

            console.info('teste1')
           
            const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(usersBeforeExport);
            fs.writeFileSync(csvFilePath, csvData);

            console.info('teste2')
         
            const updatedUsers = await User.findAll();

        
            res.render('index', { users: updatedUsers });
        } catch (error) {
            console.error('Erro ao exportar dados para CSV:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    public async getExternalUsers(req: Request, res: Response): Promise<void> {
        try {
       
            const response = await axios.get('https://random-data-api.com/api/v2/users?size=10');

        
            const externalUsers = response.data;

            
       
            res.json(externalUsers);
        } catch (error) {
            console.error('Erro ao buscar usuários externos:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    public async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    public async addUser(req: Request, res: Response): Promise<void> {
        try {
            const newUser = await User.create(req.body);
            res.json(newUser);
        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    public async editUser(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;

        try {
            const [updatedCount] = await User.update(req.body, {
                where: { id: userId },
            });

            if (updatedCount === 0) {
                res.status(404).json({ error: 'Usuário não encontrado' });
            } else {
                res.json({ message: 'Usuário atualizado com sucesso' });
            }
        } catch (error) {
            console.error('Erro ao editar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;

        try {
            const deletedCount = await User.destroy({
                where: { id: userId },
            });

            if (deletedCount === 0) {
                res.status(404).json({ error: 'Usuário não encontrado' });
            } else {
                res.json({ message: 'Usuário excluído com sucesso' });
            }
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    public async searchUsers(req: Request, res: Response): Promise<void> {
        try {
            const searchTerm = req.query.search as string;
            const users = await User.findAll({
                where: {
                
                },
            });

            res.json(users);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default new UserController();

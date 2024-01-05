import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { createObjectCsvStringifier } from "csv-writer";
import { parse } from "csv-parse";

class UserController {
  public async exportToCSV(req: Request, res: Response): Promise<void> {
    try {
      const csvFilePath = path.join(__dirname, "..", "data", "users.csv");

      const parser = fs
        .createReadStream(csvFilePath)
        .pipe(parse({ columns: true }));
      const usersBeforeExport = [];
      for await (const record of parser) {
        usersBeforeExport.push(record);
      }

      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: "id", title: "ID" },
          { id: "name", title: "Name" },
          { id: "email", title: "Email" },
        ],
      });

      const csvData =
        csvStringifier.getHeaderString() +
        csvStringifier.stringifyRecords(usersBeforeExport);
      fs.writeFileSync(csvFilePath, csvData);

      const updatedUsers = await this.readCSV(csvFilePath);

      res.render("index", { users: updatedUsers });
    } catch (error) {
      console.error("Erro ao exportar dados para CSV:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  public async getExternalUsers(req: Request, res: Response): Promise<void> {
    try {
      res.json([]);
    } catch (error) {
      console.error("Erro ao buscar usuários externos:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const csvFilePath = path.join(__dirname, "..", "data", "users.csv");

      const parser = fs
        .createReadStream(csvFilePath)
        .pipe(parse({ columns: true }));
      const users = [];
      for await (const record of parser) {
        users.push(record);
      }

      res.json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  public async addUser(req: Request, res: Response): Promise<void> {
    try {
      res.json({});
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  public async editUser(req: Request, res: Response): Promise<void> {
    try {
      const csvFilePath = path.join(__dirname, "..", "data", "users.csv");
      const userId = req.params.id;

      const existingData = await fs.promises.readFile(csvFilePath, "utf-8");

      const lines = existingData.split("\n");
      let user: string | null = null;
      for (const line of lines) {
        const fields = line.split(",");
        if (fields[0] === userId) {
          user = line;
          break;
        }
      }

      if (user) {
        const [id, name, email] = user.split(",");

        res.render("edit", { id, name, email });
      } else {
        console.error("Usuário não encontrado para edição.");
        res.status(404).json({ error: "Usuário não encontrado" });
      }
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      res.json({});
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  public async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      res.json([]);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  public async updateUserCSV(req: Request, res: Response): Promise<void> {
    try {
      const { id, name, email } = req.body;

      const csvFilePath = path.join(__dirname, "..", "data", "users.csv");

      const existingData = await fs.promises.readFile(csvFilePath, "utf-8");

      const lines = existingData.split("\n");

      let updatedData = "";
      for (const line of lines) {
        const fields = line.split(",");
        if (fields[0] === id) {
          updatedData += `${id},${name},${email}\n`;
        } else {
          updatedData += line + "\n";
        }
      }

      await fs.promises.writeFile(csvFilePath, updatedData.trim());

      const updatedUsers = await this.readCSV(csvFilePath);

      res.json(updatedUsers);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário no CSV:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  private async readCSV(filePath: string): Promise<any[]> {
    try {
      const parser = fs
        .createReadStream(filePath)
        .pipe(parse({ columns: true }));
      const users = [];
      for await (const record of parser) {
        users.push(record);
      }
      return users;
    } catch (error) {
      console.error("Erro ao ler arquivo CSV:", error);
      throw error;
    }
  }
}

export default new UserController();

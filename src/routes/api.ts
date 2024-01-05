import { Router, Request, Response } from "express";
import userController from "../controllers/UserController";

const router = Router();

router.get("/users", userController.getUsers);
router.get("/edit/:id", (req: Request, res: Response) => {});
router.post("/users", userController.addUser);
router.put("/users/:id", userController.editUser);
router.delete("/users/:id", userController.deleteUser);
router.get("/search", userController.searchUsers);
router.post("/users/csv", userController.exportToCSV);
router.get("/export-to-csv", userController.exportToCSV);
router.put("/users/update-csv/:id", userController.updateUserCSV);

export default router;

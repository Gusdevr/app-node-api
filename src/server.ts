import express from "express";
import mustacheExpress from "mustache-express";
import path from "path";
import cors from "cors";
import apiRoutes from "./routes/api";
import UserController from "./controllers/UserController";
import axios from "axios";
import fs from "fs";
import { createObjectCsvStringifier } from "csv-writer";
import { parse } from "csv-parse";

const app = express();
const PORT = process.env.PORT || 3000;

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(cors());
app.use(express.json());

// Rotas

app.get("/export-to-csv", async (req, res) => {
  try {
    const response = await axios.get(
      "https://random-data-api.com/api/v2/users?size=10"
    );

    const externalUsers = response.data;

    const csvFilePath = path.join(__dirname, "data", "users.csv");

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "id", title: "ID" },
        { id: "first_name", title: "Name" },
        { id: "email", title: "Email" },
      ],
    });

    const csvData =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(externalUsers);
    fs.writeFileSync(csvFilePath, csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    fs.createReadStream(csvFilePath).pipe(res);
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/api", apiRoutes);

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/edit/:id", async (req, res) => {
  try {
    const csvFilePath = path.join(__dirname, "data", "users.csv");

    let user = {};
    const parser = fs.createReadStream(csvFilePath).pipe(parse({ columns: true }));
    for await (const record of parser) {
      if (record.id == req.params.id) {
        user = record;
        break;
      }
    }

    console.info(user);

    res.render("edit", user);
  } catch (error) {
    console.error("Error editing user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://random-data-api.com/api/v2/users?size=10"
    );

    const externalUsers = response.data;

    const csvFilePath = path.join(__dirname, "data", "users.csv");

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "id", title: "ID" },
        { id: "first_name", title: "Name" },
        { id: "email", title: "Email" },
      ],
    });

    const csvData =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(externalUsers);
    fs.writeFileSync(csvFilePath, csvData);

    res.render("index", { users: externalUsers });
  } catch (error) {
    console.error("Error fetching external users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/add", UserController.addUser);
app.post("/edit/:id", UserController.editUser);
app.post("/delete/:id", UserController.deleteUser);

app.get("/search", (req, res) => {
  res.render("search");
});

app.use(express.static(path.join(__dirname, "pages")));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

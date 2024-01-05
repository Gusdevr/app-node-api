import express from 'express';
import mustacheExpress from 'mustache-express';
import path from 'path';
import cors from 'cors';
import apiRoutes from './routes/api';
import UserController from './controllers/UserController';
import axios from 'axios';
import fs from 'fs';
import { createObjectCsvStringifier } from 'csv-writer';
import { parse } from 'csv-parse';

const app = express();
const PORT = process.env.PORT || 3000;


app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());

// Rotas

app.get('/export-to-csv', UserController.exportToCSV);

app.use('/api', apiRoutes);

app.get('/add', (req, res) => {
    res.render('add');
});

app.get('/edit/:id', async (req, res) => {
    const csvFilePath = path.join(__dirname, 'data', 'users.csv');
    // const content =  await fs.promises.readFile(csvFilePath);

    let user = {};
    const parser = fs
    .createReadStream(csvFilePath)
    .pipe(parse({
    // CSV options if any
    }));
  for await (const record of parser) {
    // Work with each record
    if (record[0] == req.params.id)
     user = record; 
  }

  console.info(user)
   
    res.render('edit');
});


app.get('/', async (req, res) => {
    try {
      
        const response = await axios.get('https://random-data-api.com/api/v2/users?size=10');

      
        const externalUsers = response.data;

        const csvFilePath = path.join(__dirname, 'data', 'users.csv');

       
            const csvStringifier = createObjectCsvStringifier({
                header: [
                    { id: 'id', title: 'ID' },
                    { id: 'first_name', title: 'Name' },
                    { id: 'email', title: 'Email' },
                ],
            });

            console.info('teste1')
           
            const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(externalUsers);
            fs.writeFileSync(csvFilePath, csvData);

            console.info('teste2')

       
        res.render('index', { users: externalUsers });
    } catch (error) {
        console.error('Error fetching external users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/add', UserController.addUser);
app.post('/edit/:id', UserController.editUser);
app.post('/delete/:id', UserController.deleteUser);


app.post('/export-to-csv', UserController.exportToCSV);

app.get('/search', (req, res) => {
    res.render('search');
});

app.use(express.static(path.join(__dirname, 'pages')));

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

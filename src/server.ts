// src/server.ts
import express from 'express';
import mustacheExpress from 'mustache-express';
import path from 'path';
import cors from 'cors';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar o Mustache como template engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'pages'));

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', apiRoutes);

// Servir páginas estáticas
app.use(express.static(path.join(__dirname, 'pages')));

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});





import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'seu_host',
  port: 5432,
  username: 'seu_usuario',
  password: 'sua_senha',
  database: 'seu_banco_de_dados',
});

export { sequelize };

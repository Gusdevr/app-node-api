
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
});

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public name!: string;
  public email!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

export default User;

import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface ChatGroupAttributes {
  id: number;
  name: string;
  profilePhoto?: string;
  description?: string;
}

type ChatGroupCreationAttributes = Optional<ChatGroupAttributes, "id">;

export class ChatGroup extends Model<ChatGroupAttributes, ChatGroupCreationAttributes> implements ChatGroupAttributes {
  public id!: number;
  public name!: string;
  public profilePhoto?: string;
  public description?: string;
}

export const ChatGroupFactory = (sequelize: Sequelize) => {
  ChatGroup.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profilePhoto: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'chat_groups',
    sequelize
  });
  return ChatGroup;
};
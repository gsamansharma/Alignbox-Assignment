import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { User } from "./user.model";
import { ChatGroup } from "./chatGroup.model";

interface MessageAttributes {
  id: number;
  content: string;
  isAnonymous: boolean;
  status: 'SENT' | 'DELIVERED' | 'SEEN';
  groupId: number;
  userId: number;
}

type MessageCreationAttributes = Optional<MessageAttributes, "id">;

export class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public content!: string;
  public isAnonymous!: boolean;
  public status!: 'SENT' | 'DELIVERED' | 'SEEN';
  public groupId!: number;
  public userId!: number;

  public readonly user?: User;
  public readonly group?: ChatGroup;
}

export const MessageFactory = (sequelize: Sequelize) => {
  Message.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('SENT', 'DELIVERED', 'SEEN'),
      defaultValue: 'SENT'
    },
    groupId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
  }, {
    tableName: 'messages',
    sequelize
  });

  return Message;
};
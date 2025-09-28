import { Sequelize } from "sequelize";
import dbConfig from "../config/db.config";
import { UserFactory } from "./user.model";
import { ChatGroupFactory } from "./chatGroup.model";
import { GroupMemberFactory } from "./groupMember.model";
import { MessageFactory } from "./message.model";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {
  sequelize,
  Sequelize,
  users: UserFactory(sequelize),
  chatGroups: ChatGroupFactory(sequelize),
  groupMembers: GroupMemberFactory(sequelize),
  messages: MessageFactory(sequelize),
};

db.messages.belongsTo(db.users, { as: "user", foreignKey: "userId" });
db.messages.belongsTo(db.chatGroups, { as: "group", foreignKey: "groupId" });
db.users.hasMany(db.messages, { foreignKey: "userId" });
db.chatGroups.hasMany(db.messages, { foreignKey: "groupId" });


db.groupMembers.belongsTo(db.users, { as: "user", foreignKey: "userId" });
db.groupMembers.belongsTo(db.chatGroups, { as: "group", foreignKey: "groupId" });

db.users.hasMany(db.groupMembers, { foreignKey: "userId" });
db.chatGroups.hasMany(db.groupMembers, { foreignKey: "groupId" });


export default db;
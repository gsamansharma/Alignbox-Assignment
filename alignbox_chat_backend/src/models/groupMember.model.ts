import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface GroupMemberAttributes {
  id: number;
  role: 'MEMBER' | 'ADMIN';
  groupId: number;
  userId: number;
}

type GroupMemberCreationAttributes = Optional<GroupMemberAttributes, "id">;

export class GroupMember extends Model<GroupMemberAttributes, GroupMemberCreationAttributes> implements GroupMemberAttributes {
  public id!: number;
  public role!: 'MEMBER' | 'ADMIN';
  public groupId!: number;
  public userId!: number;
}

export const GroupMemberFactory = (sequelize: Sequelize) => {
  GroupMember.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM('MEMBER', 'ADMIN'),
      defaultValue: 'MEMBER'
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
    tableName: 'group_members',
    sequelize
  });
  return GroupMember;
};
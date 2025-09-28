import { Request, Response } from "express";
import db from "../models";

const Message = db.messages;
const User = db.users;
const ChatGroup = db.chatGroups;
const GroupMember = db.groupMembers;

interface SendMessageBody {
  groupId: number;
  userId: number;
  content: string;
  isAnonymous?: boolean;
}

export const sendMessage = async (req: Request<{}, {}, SendMessageBody>, res: Response) => {
  try {
    const { groupId, userId, content, isAnonymous } = req.body;
    const message = await Message.create({
      groupId,
      userId,
      content,
      isAnonymous: isAnonymous || false,
      status: 'SENT'
    });
    res.status(201).send(message);
  } catch (err: any) {
    res.status(500).send({
      message: err.message || "Some error occurred while sending the message."
    });
  }
};

export const getMessages = async (req: Request<{ groupId: string }>, res: Response) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const messages = await Message.findAll({
      where: { groupId: groupId },
      include: [
        { model: User, as: "user" },
        { model: ChatGroup, as: "group" }
      ],
      order: [['createdAt', 'ASC']]
    });
    res.send(messages);
  } catch (err: any) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving messages."
    });
  }
};

interface CreateGroupBody {
    name: string;
    description?: string;
    profilePhoto?: string;
}

export const createGroup = async (req: Request<{}, {}, CreateGroupBody>, res: Response) => {
    try {
        const { name, description, profilePhoto } = req.body;

        if (!name) {
            return res.status(400).send({ message: "Group name is required." });
        }

        const chatGroup = await ChatGroup.create({
            name,
            description,
            profilePhoto
        });

        res.status(201).send(chatGroup);
    } catch (err: any) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the group."
        });
    }
};


interface AddUserToGroupBody {
    userId: number;
    role?: 'MEMBER' | 'ADMIN';
}

export const addUserToGroup = async (req: Request<{ groupId: string }, {}, AddUserToGroupBody>, res: Response) => {
    try {
        const groupId = parseInt(req.params.groupId, 10);
        const { userId, role } = req.body;

        if (!userId) {
            return res.status(400).send({ message: "User ID is required." });
        }
        
        const user = await User.findByPk(userId);
        const group = await ChatGroup.findByPk(groupId);

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        if (!group) {
            return res.status(404).send({ message: "Group not found." });
        }

        const groupMember = await GroupMember.create({
            groupId,
            userId,
            role: role || 'MEMBER'
        });

        res.status(201).send(groupMember);

    } catch (err: any) {
        res.status(500).send({
            message: err.message || "Some error occurred while adding the user to the group."
        });
    }
};

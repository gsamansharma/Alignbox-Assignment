import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import db from "./models";
import { chatRoutes } from "./routes/chat.routes";
import cors from 'cors';
const app: Express = express();
import path from "path";
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synced");
});

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Alignbox Chat application." });
});

chatRoutes(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  await db.users.bulkCreate([
    { name: "Abhay Shukla", isAnonymous: false, avatarUrl: process.env.SERVER_ADDRESS + '/public/abhay.jpg' },
    { name: "Aman Sharma", isAnonymous: false, avatarUrl: "https://avatars.githubusercontent.com/u/88395292?v=4" },
    { name: "Neha Verma", isAnonymous: false },
    { name: "Rohit Singh", isAnonymous: true},
    { name: "Priya Kapoor", isAnonymous: false },
    { name: "Vikram Joshi", isAnonymous: false }
  ]);
  
  await db.chatGroups.bulkCreate([
    { name: "Fun Friday Group" },
    { name: "Weekend Plans" },
    { name: "Work Discussion" }
  ]);  

  await db.groupMembers.bulkCreate([
    { groupId: 1, userId: 1, role: "ADMIN" },
    { groupId: 1, userId: 2, role: "MEMBER" },
    { groupId: 1, userId: 3, role: "MEMBER" },
    { groupId: 2, userId: 2, role: "ADMIN" },
    { groupId: 2, userId: 4, role: "MEMBER" },
    { groupId: 2, userId: 5, role: "MEMBER" },
    { groupId: 3, userId: 1, role: "MEMBER" },
    { groupId: 3, userId: 6, role: "ADMIN" }
  ]);
  
  await db.messages.bulkCreate([
    { groupId: 1, userId: 1, content: "We have a Surprise for you!!", isAnonymous: false, status: "DELIVERED" },
    { groupId: 1, userId: 1, content: "hahahahah!!", isAnonymous: true, status: "SEEN" },
    { groupId: 1, userId: 2, content: "I'm Excited For this Event! Ho-Ho", isAnonymous: false, status: "SEEN" },
    { groupId: 1, userId: 3, content: "Can't wait to join!", isAnonymous: false, status: "DELIVERED" },
    { groupId: 1, userId: 2, content: "When is it happening?", isAnonymous: false, status: "DELIVERED" },
    { groupId: 2, userId: 2, content: "Weekend trip plan discussion", isAnonymous: false, status: "DELIVERED" },
    { groupId: 2, userId: 4, content: "I'm in for the trip!", isAnonymous: false, status: "SEEN" },
    { groupId: 2, userId: 5, content: "Can't make it this time.", isAnonymous: false, status: "SEEN" },
    { groupId: 3, userId: 6, content: "Work deadline is approaching, let's focus", isAnonymous: false, status: "DELIVERED" },
    { groupId: 3, userId: 1, content: "Sure, I'm on it!", isAnonymous: false, status: "DELIVERED" }
  ]);
}
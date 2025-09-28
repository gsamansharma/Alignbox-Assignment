import { Express, Router} from "express";
import * as chat from "../controllers/chat.controller";

export const chatRoutes = (app: Express) => {
  const router = Router();

  router.post("/send", chat.sendMessage);
  router.get("/messages/:groupId", chat.getMessages);

  router.post("/groups", chat.createGroup);
  router.post("/groups/:groupId/members", chat.addUserToGroup);

  app.use('/api/chat', router);
};

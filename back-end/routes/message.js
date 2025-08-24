import express from 'express';
import { getCars } from '../controllers/car.controller.js';
import { getClientMessage, manualSendMessage } from '../controllers/message.controller.js';
import { authenticateClient } from '../lib/middleware.js';

const messageRouter = express.Router()

messageRouter.get("/", authenticateClient, (req, res) => getClientMessage(req,res))
messageRouter.post("/", authenticateClient, (req, res) => manualSendMessage(req,res))

export default messageRouter
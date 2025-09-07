import express from 'express';
import { getCars } from '../controllers/car.controller.js';
import { getClientMessage, getMessageAttachment, manualSendMessage } from '../controllers/message.controller.js';
import { authenticateClient } from '../lib/middleware.js';

const messageRouter = express.Router()

messageRouter.get("/", authenticateClient, (req, res) => getClientMessage(req,res))
messageRouter.post("/", authenticateClient, (req, res) => manualSendMessage(req,res))
messageRouter.get("/attachment", (req, res) => getMessageAttachment(req,res))

export default messageRouter
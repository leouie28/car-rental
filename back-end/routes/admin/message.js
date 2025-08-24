import express from 'express';
import { getMessageById, getMessages } from '../../controllers/admin.message.controller.js';

const adminMessageRouter = express.Router()

adminMessageRouter.get("/", (req, res) => getMessages(req,res))
adminMessageRouter.get("/:id", (req, res) => getMessageById(req,res))

export default adminMessageRouter
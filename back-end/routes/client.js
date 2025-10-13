import express from 'express';
import { clientInfo, getLicense, updateClient, uploadLicense } from '../controllers/client.controller.js';
import { authenticateClient } from '../lib/middleware.js';

const clientRouter = express.Router()

clientRouter.get("/", authenticateClient, (req, res) => clientInfo(req,res))
clientRouter.put("/", authenticateClient, (req, res) => updateClient(req,res))
clientRouter.get("/getLicense", authenticateClient, (req, res) => getLicense(req,res))
clientRouter.post("/uploadLicense", authenticateClient, (req, res) => uploadLicense(req,res))

export default clientRouter
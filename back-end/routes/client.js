import express from 'express';
import { getLicense, uploadLicense } from '../controllers/client.controller.js';
import { authenticateClient } from '../lib/middleware.js';

const clientRouter = express.Router()

clientRouter.get("/getLicense", authenticateClient, (req, res) => getLicense(req,res))
clientRouter.post("/uploadLicense", authenticateClient, (req, res) => uploadLicense(req,res))

export default clientRouter
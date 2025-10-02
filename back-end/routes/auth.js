import express from 'express';
import { getClientSession, loginAdmin, loginClient, registerClient, requestCode } from '../controllers/auth.controller.js';

const authRouter = express.Router()

authRouter.get("/session", (req, res) => getClientSession(req,res))
authRouter.post("/client", (req, res) => registerClient(req,res))
authRouter.post("/client/login", (req, res) => loginClient(req,res))
authRouter.get("/client/request-code", (req, res) => requestCode(req,res))

// admin routes only
authRouter.post("/admin/login", (req, res) => loginAdmin(req,res))


export default authRouter
import express from 'express';
import { getCars } from '../controllers/car.controller.js';

const carRouter = express.Router()

carRouter.get("/", (req, res) => getCars(req,res))

export default carRouter
import express from 'express';
import { carDetails, getCars, getCarTypes } from '../controllers/car.controller.js';

const carRouter = express.Router()

carRouter.get("/", (req, res) => getCars(req,res))
carRouter.get("/types", (req, res) => getCarTypes(req,res))
carRouter.get("/:id", (req, res) => carDetails(req,res))

export default carRouter
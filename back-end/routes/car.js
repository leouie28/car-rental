import express from 'express';
import { carDetails, getCarBrands, getCars } from '../controllers/car.controller.js';

const carRouter = express.Router()

carRouter.get("/", (req, res) => getCars(req,res))
carRouter.get("/brands", (req, res) => getCarBrands(req,res))
carRouter.get("/:id", (req, res) => carDetails(req,res))

export default carRouter
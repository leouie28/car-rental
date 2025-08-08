import express from 'express';
import { addCar, carDetaisl, getCars } from '../../controllers/admin.car.controller.js';

const adminCarRouter = express.Router()

adminCarRouter.get("/", (req, res) => getCars(req,res))
adminCarRouter.post("/", (req, res) => addCar(req,res))
adminCarRouter.get("/:id", (req, res) => carDetaisl(req,res))

export default adminCarRouter
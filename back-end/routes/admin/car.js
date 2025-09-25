import express from 'express';
import { addCar, carDetaisl, deleteCar, editCar, getCars } from '../../controllers/admin.car.controller.js';

const adminCarRouter = express.Router()

adminCarRouter.get("/", (req, res) => getCars(req,res))
adminCarRouter.post("/", (req, res) => addCar(req,res))
adminCarRouter.get("/:id", (req, res) => carDetaisl(req,res))
adminCarRouter.put("/:id", (req, res) => editCar(req,res))
adminCarRouter.delete("/:id", (req, res) => deleteCar(req,res))

export default adminCarRouter
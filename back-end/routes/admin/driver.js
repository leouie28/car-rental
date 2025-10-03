import express from 'express';
import { createDriver, deleteDriver, editDriver, getDrivers } from '../../controllers/admin.driver.controller.js';

const adminDriverRouter = express.Router()

adminDriverRouter.get("/", (req, res) => getDrivers(req,res))
adminDriverRouter.post("/", (req, res) => createDriver(req,res))
adminDriverRouter.put("/:id", (req, res) => editDriver(req,res))
adminDriverRouter.delete("/:id", (req, res) => deleteDriver(req,res))

export default adminDriverRouter
import express from 'express';
import { createDriver, getDrivers } from '../../controllers/admin.driver.controller.js';

const adminDriverRouter = express.Router()

adminDriverRouter.get("/", (req, res) => getDrivers(req,res))
adminDriverRouter.post("/", (req, res) => createDriver(req,res))

export default adminDriverRouter
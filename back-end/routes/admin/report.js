import express from 'express';
import { getDetailed, getOverview } from '../../controllers/admin.report.controller.js';

const adminReportRouter = express.Router()

adminReportRouter.get("/overview", (req, res) => getOverview(req,res))
adminReportRouter.get("/detailed", (req, res) => getDetailed(req,res))

export default adminReportRouter
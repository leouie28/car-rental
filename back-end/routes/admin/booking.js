import express from 'express';
import { getBookings, updateBookingStatus } from '../../controllers/admin.booking.controller.js';

const adminBookingRouter = express.Router()

adminBookingRouter.get("/", (req, res) => getBookings(req,res))
adminBookingRouter.put("/:id", (req, res) => updateBookingStatus(req,res))

export default adminBookingRouter
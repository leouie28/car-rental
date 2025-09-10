import express from 'express';
import { activeBookingToday, assignDriverBooking, getBookings, updateBookingStatus } from '../../controllers/admin.booking.controller.js';

const adminBookingRouter = express.Router()

adminBookingRouter.get("/", (req, res) => getBookings(req,res))
adminBookingRouter.get("/active-booking-cars", (req, res) => activeBookingToday(req,res))
adminBookingRouter.put("/:id/assign-driver", (req, res) => assignDriverBooking(req,res))
adminBookingRouter.put("/:id", (req, res) => updateBookingStatus(req,res))

export default adminBookingRouter
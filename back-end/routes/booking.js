import express from 'express';
import { bookingDetails, getBookings, submitBooking } from '../controllers/booking.conroller.js';
import { authenticateClient } from '../lib/middleware.js';

const bookingRouter = express.Router()

bookingRouter.get("/", authenticateClient, (req, res) => getBookings(req,res))
bookingRouter.post("/", authenticateClient, (req, res) => submitBooking(req,res))
bookingRouter.get("/:id", (req, res) => bookingDetails(req,res))

export default bookingRouter
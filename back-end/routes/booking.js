import express from 'express';
import { bookingDetails, submitBooking } from '../controllers/booking.conroller.js';
import { authenticateClient } from '../lib/middleware.js';

const bookingRouter = express.Router()

bookingRouter.post("/", authenticateClient, (req, res) => submitBooking(req,res))
bookingRouter.get("/:id", (req, res) => bookingDetails(req,res))

export default bookingRouter
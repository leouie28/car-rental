import prisma from "../lib/prismaClient.js"
import dayjs from "dayjs";
import { io, onlineUsers } from "../server.js"
import { submitBookingRequestMessage } from "../constant/message.js";

export const getBookings = async (req, res) => {
    try {
        const userId = req.userId
        const bookings = await prisma.booking.findMany({
            where: { userId: parseInt(userId) },
            include: {
                car: { include: { images: true } },
                driver: true
            }
        })

        res.status(200).json(bookings)
    } catch (error) {
        console.log('Error on getBookings:', error);
        res.status(500).send(error);
    }
}

export const submitBooking = async (req, res) => {
    try {
        const payload = req.body
        const userId = req.userId

        const car = await prisma.car.findUnique({
            where: { id: parseInt(payload.carId) },
            include: {
                booking: {
                    where: {
                        status: {
                            in: ['confirmed', 'partially_paid', 'paid']
                        }
                    }
                }
            }
        })

        if (!car) {
            return res.status(400).json({ error: "Car not found" });
        }

        console.log(car)

        const isBooked = car.booking.some(booking => {
            const bookingStart = dayjs(booking.dateStart).startOf('day');
            const bookingEnd = dayjs(booking.dateReturn).endOf('day');
            const requestedStart = dayjs(payload.dateStart).startOf('day');
            const requestedEnd = dayjs(payload.dateReturn).endOf('day');
            return (requestedStart.isBefore(bookingEnd) && requestedEnd.isAfter(bookingStart));
        });

        if (isBooked) {
            return res.status(400).json({ error: "Car is already booked on selected date" });
        }

        const numberOfDays = dayjs(payload.dateReturn).diff(dayjs(payload.dateStart), 'day');
        const totalPrice = payload.withDriver ? car.withDriverDailyPrice * numberOfDays : car.dailyPrice * numberOfDays
        
        const booking = await prisma.booking.create({
            data: {
                userId: parseInt(userId),
                carId: parseInt(payload.carId),
                dateStart: new Date(payload.dateStart),
                dateReturn: new Date(payload.dateReturn),
                withDriver: payload.withDriver,
                pickupLocation: payload.pickupLocation,
                destination: payload.destination,
                note: payload.note,
                paymentOption: payload.paymentOption,
                daysBooked: numberOfDays,
                status: 'pending',
                totalPrice: totalPrice,
            }
        })

        const saveSmg = await prisma.message.create({
            data: {
                from: userId,
                to: null,
                message: "I just submitted a booking request.",
                attachment: {
                    bookingId: booking.id,
                },
                createdAt: new Date()
            }
        })

        const socketId = onlineUsers["admin"]
        if (socketId) {
            io.to(socketId).emit("receive_message", saveSmg)
        }

        const clientMsg = await prisma.message.create({
            data: {
                from: null,
                to: userId,
                message: submitBookingRequestMessage,
                createdAt: new Date()
            }
        })

        const clientSocketId = onlineUsers[userId]
        if (clientSocketId) {
            io.to(clientSocketId).emit("receive_message", clientMsg)
        }

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on submitBooking:', error);
        res.status(500).send(error);
    }
}

export const bookingDetails = async (req, res) => {
    try {
        const { id } = req.params
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(id) },
            include: {
                car: { include: { images: true } }
            }
        })

        res.status(200).json(booking)
    } catch (error) {
        console.log('Error on bookingDetails:', error);
        res.status(500).send(error);
    }
}
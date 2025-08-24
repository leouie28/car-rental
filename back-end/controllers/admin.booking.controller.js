import prisma from "../lib/prismaClient.js"
import dayjs from "dayjs"
import { io, onlineUsers } from "../server.js"

export const getBookings = async (req, res) => {
    try {
        const search = req.query.search
        const status = req.query.status || "all"

        const whereInput = {
            OR: search ? [
                {
                    user: {
                        OR: [
                            {
                                firstName: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                lastName: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            }
                        ]
                    }
                },
                {
                    car: {
                        OR: [
                            {
                                make: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                model: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },
                        ]
                    }
                },
            ] : undefined,
            status: status !== "all" ? status : undefined,
        }

        const count = await prisma.booking.count({
            where: {
                ...whereInput
            }
        })
        const rows = await prisma.booking.findMany({
            where: {
                ...whereInput
            },
            include: {
                car: true,
                user: true
            },
            orderBy: {
                id: "desc"
            }
        })

        res.status(200).json({
            count,
            rows
        })
    } catch (error) {
        console.log('Error on getBookings:', error);
        res.status(500).send(error);
    }
}

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        console.log(status)
        
        const booking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: { status },
        })

        const message = "Admin accept different booking similar with this date schedule. Please create new booking."
        const similarBookings = await prisma.booking.findMany({
            // data: {
            //     status: "cancelled",
            //     cancelRemarks: message
            // },
            where: {
                id: {
                    not: booking.id
                },
                carId: booking.carId,
                status: {
                    not: 'cancelled'
                },
                AND: [
                    {
                        dateStart: {
                            lte: dayjs(booking.dateReturn).endOf('day').toDate()
                        }
                    },
                    {
                        dateReturn: {
                            gte: dayjs(booking.dateStart).startOf('day').toDate()
                        }
                    }
                ]
            }
        })

        if (similarBookings.length > 0) {
            await Promise.all(similarBookings.map(async (b) => {
                const cancelled = await prisma.booking.update({
                    where: { id: b.id },
                    data: {
                        status: "cancelled",
                        cancelRemarks: message
                    },
                })

                const saveSmg = await prisma.message.create({
                    data: {
                        from: 1,
                        to: cancelled.userId,
                        message: message,
                        attachment: {
                            bookingId: cancelled.id,
                        },
                        createdAt: new Date()
                    }
                })
        
                const socketId = onlineUsers[cancelled.userId]
                if (socketId) {
                    io.to(socketId).emit("receive_message", saveSmg)
                }
            }))
        }

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on updateBookingStatus:', error);
        res.status(500).send('Server Error');
    }
}
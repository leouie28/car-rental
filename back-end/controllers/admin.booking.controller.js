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

        if (status === "confirmed" || status === "partially_paid" || status === "paid") {
            const message = "Admin accept different booking similar with this date schedule. Please create new booking."
            const similarBookings = await prisma.booking.findMany({
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
                            from: null,
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
            }else {
                const saveSmg = await prisma.message.create({
                    data: {
                        from: null,
                        to: booking.userId,
                        message: "Admin just update the status of your booking.",
                        attachment: {
                            bookingId: parseInt(booking.id),
                        },
                        createdAt: new Date()
                    }
                })

                const socketId = onlineUsers[booking.userId]
                if (socketId) {
                    io.to(socketId).emit("receive_message", saveSmg)
                }
            }
        }


        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on updateBookingStatus:', error);
        res.status(500).send('Server Error');
    }
}

export const activeBookingToday = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                dateStart: {
                    gte: dayjs().startOf("day").toISOString()
                },
                dateReturn: {
                    not: {
                        lte: dayjs().endOf("day").toISOString()
                    }
                },
                status: {
                    notIn: ["cancelled", "pending", "completed"],
                },
            },
            include: {
                user: {
                    include: {
                        location: {
                            take: 1,
                            orderBy: {
                                createdAt: "desc"
                            }
                        }
                    }
                },
                car: true
            }
        })
        res.status(200).json(bookings)
    } catch (error) {
        console.log('Error on activeBookingToday:', error);
        res.status(500).send('Server Error');
    }
}

export const assignDriverBooking = async (req, res) => {
    try {
        const { id } = req.params
        const { driverId } = req.body

        const booking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: {
                driverId: parseInt(driverId)
            }
        })

        const saveSmg = await prisma.message.create({
            data: {
                from: null,
                to: booking.userId,
                message: "Admin just assigned driver to your booking.",
                attachment: {
                    bookingId: parseInt(booking.id),
                },
                createdAt: new Date()
            }
        })

        const socketId = onlineUsers[booking.userId]
        if (socketId) {
            io.to(socketId).emit("receive_message", saveSmg)
        }

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on assignDriver:', error);
        res.status(500).send(error);
    }
}
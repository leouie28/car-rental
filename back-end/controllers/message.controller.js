import prisma from "../lib/prismaClient.js"
import { io, onlineUsers } from "../server.js"

export const getClientMessage = async (req, res) => {
    const userId = req.userId
    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        to: parseInt(userId)
                    },
                    {
                        from: parseInt(userId)
                    }
                ]
            },
            orderBy: {
                id: "desc"
            }
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log('Error on getClientMessage:', error);
        res.status(500).send(error);
    }
}

export const manualSendMessage = async (req, res) => {
    const userId = req.userId
    try {
        const { message, carId } = req.body

        const saveSmg = await prisma.message.create({
            data: {
                from: parseInt(userId),
                to: null,
                message: message,
                attachment: {
                    carId: parseInt(carId),
                },
                createdAt: new Date()
            }
        })

        const socketId = onlineUsers["admin"]
        if (socketId) {
            io.to(socketId).emit("receive_message", saveSmg)
        }

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on getClientMessage:', error);
        res.status(500).send(error);
    }
}

export const getMessageAttachment = async (req, res) => {
    try {
        const { carId, bookingId, imageIds } = req.query

        if (imageIds) {
            const images = await prisma.image.findMany({
                where: {
                    id: {
                        in: imageIds.split(",").map(d => parseInt(d))
                    }
                }
            })

            res.status(200).json(images)
        }

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on getClientMessage:', error);
        res.status(500).send(error);
    }
}

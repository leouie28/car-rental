import prisma from "../lib/prismaClient.js"

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

        await prisma.message.create({
            data: {
                from: parseInt(userId),
                to: 1,
                message: message,
                attachment: {
                    carId: parseInt(carId)
                },
                createdAt: new Date()
            }
        })

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on getClientMessage:', error);
        res.status(500).send(error);
    }
}

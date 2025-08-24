import prisma from "../lib/prismaClient.js"
import dayjs from "dayjs"

export const getMessages = async (req, res) => {
    try {
        // const search = req.query.search
        const clients = await prisma.message.groupBy({
            by: ['from'],
            where: {
                from: {
                    not: 1 // admin id
                }
            }
        })

        let messages = []
        if (clients.length) {
            const clientsMsg = await prisma.user.findMany({
                where: {
                    id: {
                        in: clients.map(x => x.from)
                    }
                },
                include: {
                    messageSend: {
                        take: 1,
                        orderBy: {
                            id: 'desc'
                        }
                    },
                    messageReceive: {
                        take: 1,
                        orderBy: {
                            id: 'desc'
                        }
                    },
                }
            })
            messages = clientsMsg.map(d => {
                const { messageReceive, messageSend, ...restData } = d
                let latest = {}
                if (messageReceive.length && messageSend.length) {
                    if (dayjs(messageReceive[0]?.createdAt).isAfter(messageSend[0]?.createdAt)) {
                        latest = messageReceive[0]
                    }else {
                        latest = messageSend[0]
                    }
                }else if (messageReceive.length) {
                    latest = messageReceive[0]
                }else if (messageSend.length) {
                    latest = messageSend[0]
                }
                return {
                    ...restData,
                    latest: latest
                }
            })
        }

        res.status(200).json(messages)
    } catch (error) {
        console.log('Error on getMessages:', error);
        res.status(500).send('Server Error');
    }
}

export const getMessageById = async (req, res) => {
    const { id } = req.params
    try {
        const client = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                email: true,
                firstName: true,
                lastName: true,
                phone: true
            }
        })

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        to: parseInt(id)
                    },
                    {
                        from: parseInt(id)
                    }
                ]
            },
            take: 200,
            orderBy: {
                id: "desc"
            }
        })

        res.status(200).json({ client, messages })
    } catch (error) {
        console.log('Error on getMessageById:', error);
        res.status(500).send('Server Error');
    }
}
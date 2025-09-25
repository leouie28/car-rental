import prisma from "../lib/prismaClient.js"
import dayjs from 'dayjs'

export const getCars = async (req, res) => {
    try {
        const type = req.query.type
        const start = req.query.start
        const end = req.query.end

        const whereInput = {
            deletedAt: null,
            type: type == "all" ? undefined : type,
            booking: start && end ? {
                none: {
                    AND: [
                        {
                            dateStart: {
                                lt: dayjs(end).startOf('day').toISOString()
                            },
                        },
                        {
                            dateReturn: {
                                gt: dayjs(start).startOf('day').toISOString()
                            },
                        },
                        {
                            status: {
                                in: ['confirmed', 'paid', 'partially_paid']
                            }
                        }
                    ]
                }
            } : undefined
        }
        const count = await prisma.car.count({
            where: {
                ...whereInput
            }
        })
        const rows = await prisma.car.findMany({
            where: {
                ...whereInput,
            },
            include: {
                images: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        res.status(200).json({
            count,
            rows
        })
    } catch (error) {
        console.log('Error on getCars:', error);
        res.status(500).send('Server Error');
    }
}

export const carDetails = async (req, res) => {
    try {
        const { id } = req.params
        const car = await prisma.car.findUnique({
            where: { id: parseInt(id) },
            include: { images: true }
        })

        res.status(200).json(car)
    } catch (error) {
        console.log('Error on carDetails:', error);
        res.status(500).send(error);
    }
}

export const getCarTypes = async (req, res) => {
    try {
        const types = await prisma.car.groupBy({
            by: ['type'],
        })

        res.status(200).json(types.map(b => b.type))
    } catch (error) {
        console.log('Error on getCarBrands:', error);
        res.status(500).send(error);
    }
}
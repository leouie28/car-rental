import prisma from "../lib/prismaClient.js"

export const getCars = async (req, res) => {
    try {
        const count = await prisma.car.count()
        const rows = await prisma.car.findMany({
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
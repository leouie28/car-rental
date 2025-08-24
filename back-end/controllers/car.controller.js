import prisma from "../lib/prismaClient.js"

export const getCars = async (req, res) => {
    try {
        const count = await prisma.car.count()
        const rows = await prisma.car.findMany({
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

export const getCarBrands = async (req, res) => {
    console.log('getCarBrands called');
    try {
        const brands = await prisma.car.groupBy({
            by: ['make'],
        })

        res.status(200).json(brands.map(b => b.make))
    } catch (error) {
        console.log('Error on getCarBrands:', error);
        res.status(500).send(error);
    }
}
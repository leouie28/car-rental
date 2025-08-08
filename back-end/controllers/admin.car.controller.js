import prisma from "../lib/prismaClient.js"

export const getCars = async (req, res) => {
    try {
        const search = req.query.search
        
        const whereInput = {
            OR: search ? [
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
                {
                    year: parseInt(search) ? parseInt(search) : undefined
                },
                {
                    color: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    transmission: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    fuelType: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    otherDetails: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    features: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    dailyPrice: parseInt(search) ? parseInt(search) : undefined
                },
                {
                    withDriverDailyPrice: parseInt(search) ? parseInt(search) : undefined
                },
            ] : undefined
        }

        const count = await prisma.car.count({
            where: {
                ...whereInput
            }
        })
        const rows = await prisma.car.findMany({
            where: {
                ...whereInput
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

export const addCar = async (req, res) => {
    const { images, ...payload } = req.body
    try {
        await prisma.car.create({
            data: payload
        })

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on addCar:', error);
        res.status(500).send('Server Error');
    }
}

export const carDetaisl = async (req, res) => {
    const { id } = req.params
    try {
        console.log(payload)

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on carDetails:', error);
        res.status(500).send('Server Error');
    }
}
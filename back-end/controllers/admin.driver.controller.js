import prisma from "../lib/prismaClient.js";

export const getDrivers = async (req, res) => {
    try {
        const search = req.query.search

        const whereInput = {
            deletedAt: null,
            OR: search ? [
                {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    licenseId: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
            ] : undefined
        }

        const count = await prisma.driver.count({
            where: {
                ...whereInput
            }
        })
        const rows = await prisma.driver.findMany({
            where: {
                ...whereInput,
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
        console.log('Error on createDriver:', error);
        res.status(500).send(error);
    }
}

export const createDriver = async (req, res) => {
    const body = req.body
    try {
        
        await prisma.driver.create({
            data: body
        })

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on createDriver:', error);
        res.status(500).send(error);
    }
}

export const editDriver = async (req, res) => {
    const body = req.body
    const { id } = req.params
    try {
        
        await prisma.driver.update({
            where: { id: parseInt(id) },
            data: body
        })

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on createDriver:', error);
        res.status(500).send(error);
    }
}

export const deleteDriver = async (req, res) => {
    const { id } = req.params
    try {
        
        await prisma.driver.update({
            where: { id: parseInt(id) },
            data: { deletedAt: new Date() }
        })

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on createDriver:', error);
        res.status(500).send(error);
    }
}
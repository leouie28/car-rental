import prisma from "../lib/prismaClient.js"

export const getLicense = async (req, res) => {
    try {
        const userId = req.userId
        const license = await prisma.license.findFirst({
            where: { userId: parseInt(userId) },
            include: { images: true },
            orderBy: { createdAt: 'desc' }
        })
        res.status(200).json(license);
    } catch (error) {
        console.log('Error on getLicense:', error);
        res.status(500).send(error)
    }
}

export const uploadLicense = async (req, res) => {
    try {
        const { base64, type } = req.body
        const userId = req.userId

        const existingLicense = await prisma.license.findFirst({
            where: { userId: parseInt(userId) },
            orderBy: { createdAt: 'desc' }
        })

        if (existingLicense) {
            await prisma.image.create({
                data: { base64, type, licenseId: existingLicense.id }
            })
        }else {
            const license = await prisma.license.create({
                data: { userId: parseInt(userId) }
            })

            await prisma.image.create({
                data: { base64, type, licenseId: license.id }
            })
        }

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on uploadLicense:', error);
        res.status(500).send(error);
    }
}
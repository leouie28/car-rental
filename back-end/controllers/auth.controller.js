import prisma from "../lib/prismaClient.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "secret_key"

export const loginAdmin = async (req, res) => {
    const { username, password } = req.body
    try {
        const adminUser = process.env.ADMIN_USERNAME
        const adminPass = process.env.ADMIN_PASSWORD
        if (username === adminUser && password === adminPass) {
            const token = jwt.sign({ isAdmin: true }, JWT_SECRET, {
                expiresIn: '7d',
            })
            res.status(200).json({ token })
        }
        res.status(401).json({ message: "Invalid credentials" })
    } catch (error) {
        console.log('Error on loginAdmin:', error);
        res.status(500).send('Server Error');
    }
}

export const registerClient = async (req, res) => {
    const paylaod = req.body
    try {
        await prisma.client.create({
            data: {
                ...paylaod,
                password: bcrypt.hashSync(paylaod.password, 10)
            }
        })

        res.status(200).json({ success: true })
    } catch (error) {
        console.log('Error on registerClient:', error);
        res.status(500).send('Server Error');
    }
}

export const loginClient = async (req, res) => {
    const { email, password } = req.body
    try {
        const client = await prisma.client.findFirst({
            where: { email: email }
        })

        if (client) {
            const matchedPassword = bcrypt.compareSync(password, client.password)

            if (matchedPassword) {
                const { password, ...clientData } = client
                const token = jwt.sign(clientData, JWT_SECRET, {
                    expiresIn: '7d',
                })
                res.status(200).json({ token })
            }
        }
        res.status(401).json({ message: "Invalid credentials" })
    } catch (error) {
        console.log('Error on loginClient:', error);
        res.status(500).send('Server Error');
    }
}

export const getClientSession = async (req, res) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        res.json({ user: decoded })
    } catch (error) {
        console.log('Error on getSession:', error);
        res.status(403).send(error)
    }
}
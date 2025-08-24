import api from "../lib/api"

const baseRoute = "/message"

export const getMessages = async () => {
    try {
        const res = await api.get(baseRoute)
        return res.data
    } catch (error) {
        console.log(error)
        return error?.response?.data || error
    }
} 

export const manualSendMessage = async (payload) => {
    const res = await api.post(baseRoute, payload)
    return res.data
} 
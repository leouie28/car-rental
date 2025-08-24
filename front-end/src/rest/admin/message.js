import api from "../../lib/api"

const baseRoute = "/admin/message"

export const getMessages = async () => {
    try {
        const res = await api.get(`${baseRoute}`)
        return res.data
    } catch (error) {
        console.log(error)
        return error?.response?.data || error
    }
} 

export const getMessageById = async (id) => {
    try {
        const res = await api.get(`${baseRoute}/${id}`)
        return res.data
    } catch (error) {
        console.log(error)
        return error?.response?.data || error
    }
} 
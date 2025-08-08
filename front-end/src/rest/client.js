import api from "../lib/api"

export const testFetch = async () => {
    try {
        const res = await api.get('/')
        return res.data
    } catch (error) {
        return error?.response?.data || error
    }
} 
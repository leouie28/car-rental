import api from "../lib/api"

export const testFetch = async () => {
    try {
        const res = await api.get('/')
        return res.data
    } catch (error) {
        return error?.response?.data || error
    }
} 

export const getLicense = async () => {
    try {
        const res = await api.get('/client/getLicense')
        return res.data
    } catch (error) {
        return error?.response?.data || error
    }
}

export const uploadLicense = async (base64, type) => {
    try {
        const res = await api.post('/client/uploadLicense', { base64, type })
        return res.data
    } catch (error) {
        return error?.response?.data || error
    }
}
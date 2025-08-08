import api from "../../lib/api"

const baseRoute = "/admin/car"

export const getCars = async (params) => {
    try {
        const res = await api.get(baseRoute, {
            params: params
        })
        return res.data
    } catch (error) {
        console.log(error)
        return error?.response?.data || error
    }
} 

export const addCar = async (payload) => {
    try {
        const res = await api.post(baseRoute, payload)
        return res.data
    } catch (error) {
        console.log(error)
        return error?.response?.data || error
    }
} 
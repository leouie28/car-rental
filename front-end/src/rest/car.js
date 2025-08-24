import api from "../lib/api"

const baseRoute = "/car"

export const getCars = async (params) => {
    const res = await api.get(baseRoute, {
        params: params
    })
    return res.data
} 

export const carDetails = async (id) => {
    try {
        const res = await api.get(`${baseRoute}/${id}`)
        return res.data
    } catch (error) {
        console.log(error)
        return error?.response?.data || error
    }
} 

export const getCarBrands = async () => {
    const res = await api.get(baseRoute+'/brands')
    return res.data
} 
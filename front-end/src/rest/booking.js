import api from "../lib/api"

const baseRoute = "/booking"

export const submitBooking = async (payload) => {
    const res = await api.post(baseRoute, payload)
    return res.data
}

export const bookingDetails = async (id) => {
    const res = await api.get(`${baseRoute}/${id}`)
    return res.data
} 
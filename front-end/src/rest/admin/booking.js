import api from "../../lib/api"

const baseRoute = "/admin/booking"

export const getBookings = async (params) => {
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

export const updateBookingStatus = async ({ id, status }) => {
    const res = await api.put(`${baseRoute}/${id}`, { status })
    return res.data
}
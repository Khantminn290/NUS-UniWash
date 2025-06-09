import { useContext } from 'react'
import { AdminBookingContext } from '../context/AdminBookingContext'

export function useAdminBooking() {
    const context = useContext(AdminBookingContext)

    if (!context) {
        throw new Error("useUser must be used within a AdminBookingProvider")
    }

    return context
}
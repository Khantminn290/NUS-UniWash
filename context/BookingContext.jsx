import { createContext, useState} from "react";
import { databases } from "../lib/appwrite";
import { ID, Permission, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "6843fa14001fa0d2b7e6"
const COLLECTION_ID = "6843fa25003cb5d52a58"

export const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [booking, setBooking] = useState([])
    const { user } = useUser()

    async function fetchBooking() {
        try {
            
        } catch (error) {
            console.log(error)
        }
    }

    async function createBooking(machineNumber, selectedDate, selectedSlot) {
        try {
            const newBooking = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                machineNumber,
                selectedDate,
                selectedSlot,
                userId: user.$id
                },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))

                ]
            )
            console.log("New booking created:", newBooking);
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteBooking(id) {
        try {

        } catch (error) {
            console.log(eror)
        }
    }

    return (
        <BookingContext.Provider value={{ booking, fetchBooking, createBooking, deleteBooking }}>
            {children}
        </BookingContext.Provider>
    )
}
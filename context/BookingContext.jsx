import { createContext, useEffect, useState} from "react";
import { databases, client } from "../lib/appwrite";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "6843fa14001fa0d2b7e6"
const COLLECTION_ID = "6843fa25003cb5d52a58"

export const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [booking, setBooking] = useState([])
    const { user } = useUser()

    async function fetchBooking() {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.equal('userId', user.$id) // grab all the booking records in the collection where this condition is true
                ]
            )
            setBooking(response.documents)
            console.log(response.documents)
        } catch (error) {
            console.log(error)
        }
    }

    async function createBooking(machineNumber, selectedDate, selectedSlot, userName) {
        try {
            const newBooking = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                machineNumber,
                selectedDate,
                selectedSlot,
                userId: user.$id,
                userName
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
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id
            )
        } catch (error) {
            console.log(eror)
        }
    }

    useEffect(() => {
        let unsubscribe
        const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`

        if (user) {
            fetchBooking()

            unsubscribe = client.subscribe(channel, (response) => {
                const { payload, events} = response

                if (events[0].includes('create')) {
                    setBooking((prevBooking) => [...prevBooking, payload])
                }

                if (events[0].includes('delete')) {
                    setBooking((prevBooking) => prevBooking.filter((booking) => booking.$id !== payload.$id))
                }
            })
        } else {
            setBooking([])
        }

        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [user])

    return (
        <BookingContext.Provider value={{ booking, fetchBooking, createBooking, deleteBooking }}>
            {children}
        </BookingContext.Provider>
    )
}
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
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
    
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.greaterThanEqual('selectedDate', todayStr),
                Query.equal('userId', user.$id),
            ]
        );
        setBooking(response.documents);
        
    } catch (error) {
        console.log(error);
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
    let unsubscribe;
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;

    if (user) {
        fetchBooking();

        unsubscribe = client.subscribe(channel, (response) => {
            const { payload, events } = response;

            // Only process if the booking belongs to current user
            if (payload.userId !== user.$id) return;

            const now = new Date();
            const todayStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
            const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:mm"

            const { selectedDate, selectedSlot } = payload;
            const [startTime, endTime] = selectedSlot.split(' - ').map((s) => s.trim());

            const isOngoing =
                selectedDate === todayStr &&
                currentTimeStr >= startTime &&
                currentTimeStr <= endTime;

            if (!isOngoing) return; // Ignore irrelevant bookings

            if (events[0].includes('create')) {
                setBooking((prevBooking) => [...prevBooking, payload]);
            }

            if (events[0].includes('delete')) {
                setBooking((prevBooking) => prevBooking.filter((booking) => booking.$id !== payload.$id));
            }
        });
        } else {
            setBooking([]);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    // auto refreshes every new day so that old bookings will not be displayed
    useEffect(() => {
        const now = new Date();

        // Calculate time left until midnight
        const timeUntilMidnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1, // next day
            0, 0, 0, 0 // 00:00:00
        ) - now;

        const timeout = setTimeout(() => {
            fetchBooking(); // refresh bookings at midnight
        }, timeUntilMidnight);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <BookingContext.Provider value={{ booking, fetchBooking, createBooking, deleteBooking }}>
            {children}
        </BookingContext.Provider>
    )
}
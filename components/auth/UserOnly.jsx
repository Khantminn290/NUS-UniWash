import { useRouter } from "expo-router"
import { useUser } from "../../hooks/useUser"
import { useEffect } from "react"
import { Text } from "react-native"
import ThemedLoader from "../ThemedLoader"

const UserOnly = ({ children }) => {
    const { user, authChecked } = useUser()
    const router = useRouter()

    useEffect(() => {
        // if the user is == null means not logged in we redirect the usert to the login page
        if (authChecked && user === null) {
            router.replace('/loginpage')
        }
    }, [user, authChecked])

    if (!authChecked || !user) {
        return (
            <ThemedLoader/>
        )
    }
    
    return children
}

export default UserOnly
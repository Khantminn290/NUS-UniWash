import { createContext, useState, useEffect } from "react";
import { account } from "../lib/appwrite"
import { ID } from "react-native-appwrite"

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const [authChecked, setAuthChecked] = useState(false)

    async function login(email, password) {
      try {
        await account.createEmailPasswordSession(email, password)
        const response = await account.get()
        setUser(response)
      } catch (error) {
        throw Error(error.message)
      }
    }

    async function register(email, password, name) {
      try {
      // Check if user is already logged in
        const current = await account.get();
      
      if (current) {
        throw new Error("You are already logged in. Please log out before registering a new account.");
      }
    } catch (error) {
      // If not logged in, Appwrite throws error with code 401 (unauthorized)
      if (error.code !== 401) {
        throw new Error(error.message);
      }
    }

    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
      await account.createVerification("nusapp://verify"); // new line added for authentication
      alert("Verification email sent! Please check your inbox."); // new line added for authentication 
    } catch (error) {
      if (error.code === 409) {  // 409 is usually "Conflict" for duplicate
      throw new Error("This email is already registered. Please log in or use another email.");
      }
      throw new Error(error.message);
    }
  }

  async function logout() {
      await account.deleteSession("current")
      setUser(null)
  }

  async function getInitialUserValue() {
    try {
      const res = await account.get()
      setUser(res)
    } catch (error) {
      setUser(null)
    } finally {
      setAuthChecked(true)
    }
  }

  async function changeUserName(newName) {
    try {
      const updatedUser = await account.updateName(newName);
      const response = await account.get()
      setUser(response)
    } catch (error) {

    }
  }

  useEffect(() => {
  getInitialUserValue()
  }, [])

    return (
      <UserContext.Provider value={{ user, login, register, logout, authChecked, changeUserName}}>
        {children}
      </UserContext.Provider>
    )
}
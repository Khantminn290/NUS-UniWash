import { createContext, useEffect, useState } from "react";
import { databases, client } from "../lib/appwrite";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";

// Appwrite database and collection IDs
const DATABASE_ID = "6843fa14001fa0d2b7e6";
const ISSUE_COLLECTION_ID = "6884f6d8000caa2bd3ed"; 

// Create context for issue reporting
export const IssueReportingContext = createContext();

export function IssueReportingProvider({ children }) {
  const [issues, setIssues] = useState([]); // State to hold list of reported issues
  const { user } = useUser(); // Get current logged-in user

  // Fetch all issues from Appwrite (limit 100)
  async function fetchIssues() {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        ISSUE_COLLECTION_ID,
        [Query.limit(100)]
      );
      setIssues(res.documents); // Store issues in state
    } catch (error) {
      console.log("Error fetching issues:", error);
    }
  }

  // Create a new issue document in Appwrite
  async function createIssue(description, userName) {
    try {
      const newIssue = await databases.createDocument(
        DATABASE_ID,
        ISSUE_COLLECTION_ID,
        ID.unique(), // Unique ID for new issue
        {
          description,
          userId: user.$id, // Link issue to the reporting user
          userName
        },
        [
          Permission.read(Role.user(user.$id)),   // Only the user can read
          Permission.update(Role.user(user.$id)), // Only the user can update
          Permission.delete(Role.user(user.$id)), // Only the user can delete
        ]
      );
      console.log("New issue created:", newIssue);
    } catch (error) {
      console.log("Error creating issue:", error);
    }
  }

  // Delete an existing issue by ID
  async function deleteIssue(id) {
    try {
      await databases.deleteDocument(DATABASE_ID, ISSUE_COLLECTION_ID, id);
    } catch (error) {
      console.log("Error deleting issue:", error);
    }
  }

  // Real-time subscription for issue changes (create, delete)
  useEffect(() => {
    let unsubscribe;
    const channel = `databases.${DATABASE_ID}.collections.${ISSUE_COLLECTION_ID}.documents`;

    if (user) {
      fetchIssues(); // Fetch issues when user logs in

      // Subscribe to real-time events for issue documents
      unsubscribe = client.subscribe(channel, (response) => {
        const { payload, events } = response;

        // Handle real-time create event
        if (events[0].includes("create")) {
          setIssues((prev) => [...prev, payload]);
        }

        // Handle real-time delete event
        if (events[0].includes("delete")) {
          setIssues((prev) => prev.filter((issue) => issue.$id !== payload.$id));
        }
      });
    } else {
      setIssues([]); // Clear issues if user logs out
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Refresh issues list automatically at midnight daily
  useEffect(() => {
    const now = new Date();
    const timeUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

    const timeout = setTimeout(() => {
      fetchIssues(); // Fetch new issues at midnight
    }, timeUntilMidnight);

    // Cleanup timeout on unmount
    return () => clearTimeout(timeout);
  }, []);

  // Provide state and functions to children components
  return (
    <IssueReportingContext.Provider
      value={{ issues, fetchIssues, createIssue, deleteIssue }}
    >
      {children}
    </IssueReportingContext.Provider>
  );
}


import { createContext, useEffect, useState } from "react";
import { databases, client } from "../lib/appwrite";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "6843fa14001fa0d2b7e6";
const ISSUE_COLLECTION_ID = "6884f6d8000caa2bd3ed"; 

export const IssueReportingContext = createContext();

export function IssueReportingProvider({ children }) {
  const [issues, setIssues] = useState([]);
  const { user } = useUser();

  async function fetchIssues() {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        ISSUE_COLLECTION_ID,
        [Query.limit(100)]
      );
      setIssues(res.documents);
    } catch (error) {
      console.log("Error fetching issues:", error);
    }
  }

  async function createIssue(description, userName) {
    try {
      const newIssue = await databases.createDocument(
        DATABASE_ID,
        ISSUE_COLLECTION_ID,
        ID.unique(),
        {
          description,
          userId: user.$id,
          userName
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );
      console.log("New issue created:", newIssue);
    } catch (error) {
      console.log("Error creating issue:", error);
    }
  }

  async function deleteIssue(id) {
    try {
      await databases.deleteDocument(DATABASE_ID, ISSUE_COLLECTION_ID, id);
    } catch (error) {
      console.log("Error deleting issue:", error);
    }
  }

  useEffect(() => {
  let unsubscribe;
  const channel = `databases.${DATABASE_ID}.collections.${ISSUE_COLLECTION_ID}.documents`;

  if (user) {
    fetchIssues();

    unsubscribe = client.subscribe(channel, (response) => {
      const { payload, events } = response;

      // Removed user-specific filtering so all issue changes are tracked
      if (events[0].includes("create")) {
        setIssues((prev) => [...prev, payload]);
      }

      if (events[0].includes("delete")) {
        setIssues((prev) => prev.filter((issue) => issue.$id !== payload.$id));
      }
    });
  } else {
    setIssues([]);
  }

  return () => {
    if (unsubscribe) unsubscribe();
  };
}, [user]);

  useEffect(() => {
    const now = new Date();
    const timeUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

    const timeout = setTimeout(() => {
      fetchIssues();
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <IssueReportingContext.Provider
      value={{ issues, fetchIssues, createIssue, deleteIssue }}
    >
      {children}
    </IssueReportingContext.Provider>
  );
}

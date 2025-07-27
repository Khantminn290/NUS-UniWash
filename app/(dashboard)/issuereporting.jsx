import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable,
  StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, SafeAreaView
} from 'react-native';

import { useUser } from '../../hooks/useUser'; // Custom hook to get current user
import { useIssueReporting } from '../../hooks/useIssueReporting'; // Custom hook to handle issue reporting logic

const IssueReporting = () => {
  const { user } = useUser(); // Current logged-in user
  const [issueText, setIssueText] = useState(''); // Text input for new issue

  // Destructure functions and data from custom hook
  const {
    issues = [],
    createIssue,
    fetchIssues,
    deleteIssue
  } = useIssueReporting();

  // Fetch existing issues when component mounts
  useEffect(() => {
    fetchIssues();
  }, []);

  // Handle submitting a new issue
  const handleSubmit = async () => {
    if (!issueText.trim()) {
      Alert.alert("Input Error", "Please enter an issue.");
      return;
    }

    try {
      await createIssue(issueText, user.name); // Save the issue to the database
      Alert.alert("Issue Submitted", "Thank you for reporting.");
      setIssueText(''); // Clear the input
      await fetchIssues(); // Refresh the list
    } catch (error) {
      console.error("Error submitting issue:", error);
      Alert.alert("Submission Failed", "Could not submit the issue.");
    }
  };

  // Handle deleting an issue (only for the user who created it)
  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Issue",
      "Are you sure you want to delete this issue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteIssue(id); // Delete the issue from the database
              await fetchIssues();   // Refresh the list
            } catch (err) {
              console.error("Delete error:", err);
              Alert.alert("Delete Failed", "Could not delete the issue.");
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Report an Issue</Text>
        </View>

        {/* Issue Submission Form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Your Issue</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe the issue here..."
            multiline
            value={issueText}
            onChangeText={setIssueText}
          />

          {/* Submit Button */}
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Issue</Text>
          </Pressable>

          <Text style={styles.sectionTitle}>Reported Issues</Text>
        </View>

        {/* List of Submitted Issues */}
        <FlatList
          style={styles.flatListStyle}
          data={issues}
          keyExtractor={(item) => item.$id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={true}
          ListEmptyComponent={
            <Text style={styles.noIssuesText}>No issues reported yet.</Text>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.issueItem}>
              {/* Name of person who reported the issue */}
              <Text style={styles.issueUserName}>{item.userName}</Text>

              {/* Description of the issue */}
              <Text style={styles.issueDescription}>{item.description}</Text>

              {/* Date and time the issue was created */}
              <Text style={styles.issueDate}>
                {new Date(item.$createdAt).toLocaleString()}
              </Text>

              {/* Show delete button only if the issue was created by this user */}
              {item.userId === user.$id && (
                <Pressable
                  onPress={() => handleDelete(item.$id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              )}
            </Pressable>
          )}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default IssueReporting;

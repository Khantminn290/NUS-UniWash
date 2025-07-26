import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable,
  StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, SafeAreaView
} from 'react-native';
import { useUser } from '../../hooks/useUser';
import { useIssueReporting } from '../../hooks/useIssueReporting';

const IssueReporting = () => {
  const { user } = useUser();
  const [issueText, setIssueText] = useState('');

  const {
    issues = [],
    createIssue,
    fetchIssues,
    deleteIssue
  } = useIssueReporting();

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleSubmit = async () => {
    if (!issueText.trim()) {
      Alert.alert("Input Error", "Please enter an issue.");
      return;
    }

    try {
      await createIssue(issueText, user.name);
      Alert.alert("Issue Submitted", "Thank you for reporting.");
      setIssueText('');
      await fetchIssues();
    } catch (error) {
      console.error("Error submitting issue:", error);
      Alert.alert("Submission Failed", "Could not submit the issue.");
    }
  };

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
              await deleteIssue(id);
              await fetchIssues();
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

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Your Issue</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe the issue here..."
            multiline
            value={issueText}
            onChangeText={setIssueText}
          />

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Issue</Text>
          </Pressable>

          <Text style={styles.sectionTitle}>Reported Issues</Text>
        </View>

        {/* Issues List */}
        <FlatList
          style={styles.flatListStyle}
          data={issues}
          keyExtractor={(item) => item.$id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.flatListContainer}
          ListEmptyComponent={
            <Text style={styles.noIssuesText}>No issues reported yet.</Text>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.issueItem}>
              <Text style={styles.issueUserName}>{item.userName}</Text>
              <Text style={styles.issueDescription}>{item.description}</Text>
              <Text style={styles.issueDate}>
                {new Date(item.$createdAt).toLocaleString()}
              </Text>

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
          showsVerticalScrollIndicator={true}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default IssueReporting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3DD',
  },
  header: {
    padding: 10,
    backgroundColor: '#FF6B35',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  formContainer: {
    padding: 16,
  },
  flatListStyle: {
    flex: 1,
  },
  flatListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 30,
    marginBottom: 16,
  },
  issueItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  issueUserName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  issueDescription: {
    color: '#333',
  },
  issueDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
  noIssuesText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#E74C3C',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
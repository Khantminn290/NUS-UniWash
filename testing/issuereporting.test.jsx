import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import IssueReporting from '../app/(dashboard)/issuereporting';
import { useUser } from '../hooks/useUser';
import { useIssueReporting } from '../hooks/useIssueReporting';

// Mocks
jest.mock('../hooks/useUser');
jest.mock('../hooks/useIssueReporting');

beforeAll(() => {
  jest.spyOn(Alert, 'alert');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('IssueReporting Component', () => {
  it('shows alert when submitting empty issue', () => {
    useUser.mockReturnValue({ user: { $id: 'u1', name: 'Test User' } });
    useIssueReporting.mockReturnValue({
      issues: [],
      createIssue: jest.fn(),
      fetchIssues: jest.fn(),
      deleteIssue: jest.fn(),
    });

    const { getByText } = render(<IssueReporting />);
    fireEvent.press(getByText('Submit Issue'));

    expect(Alert.alert).toHaveBeenCalledWith("Input Error", "Please enter an issue.");
  });

  it('calls createIssue with correct issue text and user name', async () => {
    const mockCreateIssue = jest.fn().mockResolvedValue();
    useUser.mockReturnValue({ user: { $id: 'user123', name: 'John' } });
    useIssueReporting.mockReturnValue({
      issues: [],
      createIssue: mockCreateIssue,
      fetchIssues: jest.fn(),
      deleteIssue: jest.fn(),
    });

    const { getByPlaceholderText, getByText } = render(<IssueReporting />);
    fireEvent.changeText(getByPlaceholderText('Describe the issue here...'), 'Machine broken');
    fireEvent.press(getByText('Submit Issue'));

    await waitFor(() => {
      expect(mockCreateIssue).toHaveBeenCalledWith('Machine broken', 'John');
    });
  });

  it('shows delete button only if issue belongs to current user', () => {
    useUser.mockReturnValue({ user: { $id: 'u1', name: 'Alice' } });
    useIssueReporting.mockReturnValue({
      issues: [{
        $id: 'i1',
        description: 'Test issue',
        userName: 'Alice',
        userId: 'u1',
        $createdAt: new Date().toISOString()
      }],
      createIssue: jest.fn(),
      fetchIssues: jest.fn(),
      deleteIssue: jest.fn(),
    });

    const { getByText } = render(<IssueReporting />);
    expect(getByText('Delete')).toBeTruthy();
  });

  it('submits an issue and updates the list', async () => {
    const mockCreateIssue = jest.fn().mockResolvedValue();
    const mockFetchIssues = jest.fn();
    useUser.mockReturnValue({ user: { $id: 'u1', name: 'Alice' } });
    useIssueReporting.mockReturnValue({
      issues: [],
      createIssue: mockCreateIssue,
      fetchIssues: mockFetchIssues,
      deleteIssue: jest.fn(),
    });

    const { getByPlaceholderText, getByText } = render(<IssueReporting />);
    fireEvent.changeText(getByPlaceholderText('Describe the issue here...'), 'Power issue');
    fireEvent.press(getByText('Submit Issue'));

    await waitFor(() => {
      expect(mockCreateIssue).toHaveBeenCalledWith('Power issue', 'Alice');
      expect(mockFetchIssues).toHaveBeenCalledTimes(2); 
    });
  });

  it('deletes an issue and refetches the list', async () => {
    const mockDeleteIssue = jest.fn().mockResolvedValue();
    const mockFetchIssues = jest.fn();
    useUser.mockReturnValue({ user: { $id: 'u1', name: 'Alice' } });
    useIssueReporting.mockReturnValue({
      issues: [{
        $id: 'i1',
        description: 'Leak detected',
        userName: 'Alice',
        userId: 'u1',
        $createdAt: new Date().toISOString(),
      }],
      createIssue: jest.fn(),
      fetchIssues: mockFetchIssues,
      deleteIssue: mockDeleteIssue,
    });

    const { getByText } = render(<IssueReporting />);
    fireEvent.press(getByText('Delete'));

    // Simulate alert confirmation
    const deleteAction = Alert.alert.mock.calls[0][2][1]; // 2nd button: Delete
    await waitFor(() => {
      deleteAction.onPress(); // Trigger delete
    });

    await waitFor(() => {
      expect(mockDeleteIssue).toHaveBeenCalledWith('i1');
      expect(mockFetchIssues).toHaveBeenCalledTimes(2); // once in useEffect, once after delete
    });
  });

 // Shows fallback when no issues exist
  it('shows fallback text when no issues are reported', () => {
    useUser.mockReturnValue({ user: { $id: 'u1', name: 'Alice' } });
    useIssueReporting.mockReturnValue({
      issues: [],
      createIssue: jest.fn(),
      fetchIssues: jest.fn(),
      deleteIssue: jest.fn(),
    });

    const { getByText } = render(<IssueReporting />);
    expect(getByText('No issues reported yet.')).toBeTruthy();
  });
});

import { useContext } from 'react'
import { IssueReportingContext } from '../context/IssueReportingContext'

export function useIssueReporting() {
    const context = useContext(IssueReportingContext)

    if (!context) {
        throw new Error("useUser must be used within a IssueReportingProvider")
    }

    return context
}
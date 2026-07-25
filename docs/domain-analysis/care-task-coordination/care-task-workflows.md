# Care Task Coordination Workflow

## Main Workflow

1. CareCoordinator creates a CareTask.
2. CareCoordinator defines the CareTask details:
   - title
   - description
   - resident
   - caregiver(optional)
   - room
   - due time
   - priority
   - steps to complete (optional)
3. CareCoordinator adds the CareTask to Today's CareTaskList.
4. CareCoordinator assigns the CareTask to a Caregiver.
5. Caregiver sees the assigned CareTask in My Tasks.
6. Caregiver opens the CareTask details.
7. Caregiver updates the CareTask status:
   - Completed
   - Unable To Complete
   - Need Assistance
8. CareCoordinator monitors CareTask statuses in the dashboard.
9. If the due time passes and the CareTask is not completed, the CareTask becomes Overdue.
10. The dashboard shows how long the CareTask has been overdue in minutes or hours.
11. If the CareTask remains overdue when the assigned Caregiver’s working shift ends, the CareTask becomes Missed.
12. CareCoordinator reviews Overdue CareTasks and decides whether to:
   - reassign the CareTask
   - Force-Compelet the CareTask
   - cancel the CareTask
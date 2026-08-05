# CareTaskCoordination Bounded Context: Business Use Cases


## Core Purpose

The CareTaskCoordination bounded context manages the full lifecycle of care-related tasks inside a nursing home:

```text
Create → Plan → Assign → Perform → Update Status → Monitor → Review → Close
```

It helps answer:

```text
What care work needs to be done?
Who is responsible?
When should it be done?
What is the current status?
Was it completed, not completed, overdue, missed, or cancelled?
Does the Caregiver need assistance?
What should the CareCoordinator do next?
```

---

# Actors

## Primary Actors

```text
CareCoordinator
Caregiver
System
```

## Supporting Actors

```text
Manager
Admin
Resident Profile Management Context
Caregiver Profile Management Context
Authentication / Identity Context
Logging / Audit Context
```

---

# Use Case Groups

The use cases can be grouped into these areas:

```text
1. CareTask Creation and Planning
2. CareTask Assignment
3. Caregiver Task Execution
4. Status and Lifecycle Management
5. Overdue and Missed Task Handling
6. Cancellation and Reactivation
7. Dashboard and Monitoring
8. Audit and History
9. Validation and Supporting Checks
```

---

# 1. CareTask Creation and Planning Use Cases

---

## UC-001: Create CareTask

### Primary Actor

```text
CareCoordinator
```

### Goal

Create a new CareTask that represents a care-related responsibility.

### Description

A CareCoordinator creates a CareTask for a resident, room, location, or general care operation. The CareTask describes what needs to be done, when it should be done, and how important it is.

### Preconditions

```text
CareCoordinator is authenticated.
CareCoordinator has permission to create CareTasks.
```

### Main Flow

```text
1. CareCoordinator starts creating a new CareTask.
2. CareCoordinator enters task title.
3. CareCoordinator optionally enters description.
4. CareCoordinator selects Resident, Room, or Location if applicable.
5. CareCoordinator sets DueTime.
6. CareCoordinator sets TaskPriority.
7. CareCoordinator saves the CareTask.
8. System creates the CareTask.
```

### Business Rules

```text
A CareTask must have a title.
A CareTask must have a DueTime.
A CareTask must have a TaskPriority.
A CareTask must be linked to a Resident, Room, or Location.
A CareTask must have a Creator.
```

### Result

```text
A new CareTask exists in Planned status and automatically goes into Today's CareTaskList.
```
---

---

## UC-002: Update CareTask Details

As A CareCoordinator I should be able to modify CareTask information before it is completed or missed!
A CareCoordinator updates the title, description, DueTime, priority, resident reference, room reference, or location reference of a CareTask.

### Preconditions

```text
CareTask exists.
CareTask is not Completed.
CareTask is not Missed.
CareTask is not Cancelled unless reactivation or correction is allowed.
CareCoordinator has permission to update the CareTask.
```

### Main Flow

```text
1. CareCoordinator opens CareTask details.
2. CareCoordinator edits allowed fields.
3. System checks whether the change is allowed.
4. If the change happens close to DueTime, system requests LateChangeReason.
5. CareCoordinator confirms the update.
6. System saves updated details.
7. System records the change.
```

### Business Rules

```text
CareTask details may be updated before DueTime.
If CareTask details are updated less than 15 minutes before DueTime, LateChangeReason is required.
Completed CareTasks should not be edited.
Cancelled CareTasks should not be edited unless reactivated.
All detail changes must be recorded in history.
```

---

## UC-003: Change CareTask Priority

A CareCoordinator changes the TaskPriority of a CareTask when the situation changes.

### Preconditions

```text
CareTask exists.
CareTask is not Completed.
CareTask is not Cancelled.
CareCoordinator has permission to update priority.
```

### Main Flow

```text
1. CareCoordinator opens the CareTask.
2. CareCoordinator selects a new TaskPriority.
3. System validates the change.
4. System updates the priority.
5. System records the priority change.
```

### Business Rules

```text
TaskPriority must be one of the allowed values.
Critical or High priority tasks should be visible clearly in dashboard.
Changing priority close to DueTime may require a reason.
```

---

## UC-004: Change CareTask DueTime

A CareCoordinator changes the DueTime of a CareTask because the care plan, resident situation, caregiver workload, or operational priority has changed.

### Preconditions

```text
CareTask exists.
CareTask is not Completed.
CareTask is not Cancelled.
CareCoordinator has permission to change DueTime.
```

### Main Flow

```text
1. CareCoordinator opens the CareTask.
2. CareCoordinator changes DueTime.
3. System checks whether the new DueTime is valid.
4. If the change is close to the current DueTime, system requires LateChangeReason.
5. System updates DueTime.
6. System records the change.
```

### Business Rules

```text
DueTime cannot be empty for a published CareTask.
DueTime should not be in the past.
Late DueTime changes require a reason.
Changing DueTime may affect Overdue status.
```

---



# 2. Caregiver Task Execution Use Cases

---

## UC-010: View My Tasks

A Caregiver opens My Tasks to see the CareTasks they are responsible for.

### Preconditions

```text
Caregiver is authenticated.
Caregiver has assigned CareTasks.
```

### Main Flow

```text
1. Caregiver opens My Tasks.
2. System shows CareTasks assigned to the Caregiver.
3. System displays title, Resident/Room if applicable, DueTime, priority, and status.
4. Caregiver can open a CareTask for details.
```

### Business Rules

```text
Caregiver should only see CareTasks they are allowed to access.
Completed and Cancelled CareTasks may be hidden from active view but available in history.
CareTasks should be ordered by DueTime and priority.
```

---

## UC-011: View CareTask Details

A Caregiver opens a CareTask to see full details before performing the care activity, 
so they Understand what needs to be done for a CareTask.


### Preconditions

```text
CareTask exists.
Caregiver has permission to view the CareTask.
```

### Main Flow

```text
1. Caregiver selects a CareTask from My Tasks.
2. System displays CareTask details.
3. System shows title, description, Resident/Room/Location, DueTime, priority, and status.
4. Caregiver decides what action to take.
```

### Business Rules

```text
Sensitive resident data should not be shown unless required and permitted.
CareTask details should be clear and practical.
Caregiver should see changes that affect their assigned work.
```
---

## UC-012: Complete CareTask

A Caregiver completes the care work and marks the CareTask as Completed.

### Preconditions

```text
CareTask exists.
CareTask is assigned to the Caregiver.
CareTask is not Cancelled.
CareTask is not Missed unless reactivation allows completion.
CareTask is not already Completed.
```

### Main Flow

```text
1. Caregiver opens the CareTask.
2. Caregiver selects Completed.
3. Caregiver optionally adds a completion note.
4. System validates completion.
5. System changes CareTask status to Completed.
6. System records completedAt and completedBy.
```

### Business Rules

```text
Only assigned Caregiver should normally complete the CareTask.
Completed CareTask cannot be completed again.
Cancelled CareTask cannot be completed.
If completed after DueTime, the CareTask is considered completed late.
Completion must record who completed it and when.
```
---

## UC-013: Mark CareTask as UnableToComplete

A Caregiver marks the CareTask as UnableToComplete when they cannot complete it because of a clear reason.

### Preconditions

```text
CareTask exists.
CareTask is assigned to the Caregiver.
CareTask is not Completed.
CareTask is not Cancelled.
```

### Main Flow

```text
1. Caregiver opens the CareTask.
2. Caregiver selects UnableToComplete.
3. System asks for reason.
4. Caregiver selects or writes reason.
5. System validates the reason.
6. System changes status to UnableToComplete.
7. System makes the CareTask visible to CareCoordinator for review.
```

### Business Rules

```text
UnableToComplete requires a reason.
UnableToComplete does not automatically mean Cancelled.
CareCoordinator should review UnableToComplete CareTasks.
```
---

## UC-014: Request Assistance for CareTask

A Caregiver marks a CareTask as NeedAssistance when they cannot safely or properly complete it alone.

### Preconditions

```text
CareTask exists.
CareTask is assigned to the Caregiver.
CareTask is not Completed.
CareTask is not Cancelled.
```

### Main Flow

```text
1. Caregiver opens the CareTask.
2. Caregiver selects NeedAssistance.
3. System asks for AssistanceReason.
4. Caregiver provides reason.
5. System changes status to NeedAssistance.
6. System highlights the CareTask in CareCoordinatorDashboard.
```

### Business Rules

```text
NeedAssistance should be visible immediately to CareCoordinator.
NeedAssistance CareTask may later become Completed, UnableToComplete, Overdue, Missed, or Cancelled.
AssistanceReason may be required.
```

---

## UC-015: Add CareTask Note

A Caregiver or CareCoordinator adds a note to explain what happened, why a task was delayed, why assistance was needed, or what follow-up is required.

### Preconditions

```text
CareTask exists.
Actor has permission to add note.
```

### Main Flow

```text
1. Actor opens CareTask.
2. Actor writes a note.
3. System saves the note with author and timestamp.
4. System shows the note in CareTask history.
```

### Business Rules

```text
Notes must be linked to CareTask.
Notes must record author and timestamp.
Notes should not contain unnecessary sensitive information.
Notes may be required for some status changes.
```

---

# 4. Status and Lifecycle Management Use Cases

---

## UC-016: Mark CareTask as Overdue

The system marks a CareTask as Overdue when its DueTime has passed and it has not been completed, cancelled, or missed.

### Preconditions

```text
CareTask exists.
CareTask has DueTime.
Current time is later than DueTime.
CareTask is not Completed.
CareTask is not Cancelled.
CareTask is not Missed.
```

### Main Flow

```text
1. System checks active CareTasks.
2. System compares current time with DueTime.
3. System identifies incomplete CareTasks past DueTime.
4. System marks them as Overdue.
5. System records BecameOverdueAt.
6. System updates dashboard.
```

### Business Rules

```text
Overdue means late but still potentially recoverable.
OverdueDuration should be calculated from DueTime.
Overdue CareTasks should be visible in the dashboard.
```

---

## UC-017: Calculate Overdue Duration

The system calculates and displays the amount of time between DueTime and current time for Overdue CareTasks.

### Preconditions

```text
CareTask is Overdue.
CareTask has DueTime.
```

### Main Flow

```text
1. System reads DueTime.
2. System reads current time.
3. System calculates current time minus DueTime.
4. System displays overdue duration in minutes or hours.
```

### Business Rules

```text
Overdue duration should be shown in minutes for short delays.
Overdue duration should be shown in hours and minutes for longer delays.
Completed CareTasks do not show active overdue duration.
Completed late CareTasks may show completed late duration in reports.
```
---

## UC-018: Mark CareTask as Missed

The system marks a CareTask as Missed if it remains incomplete when the assigned Caregiver’s working shift ends.

### Preconditions

```text
CareTask exists.
CareTask is assigned to a Caregiver.
Assigned Caregiver has a known shift end time.
CareTask is not Completed.
CareTask is not Cancelled.
CareTask is incomplete when shift ends.
```

### Main Flow

```text
1. System checks assigned CareTasks at or after Caregiver shift end.
2. System identifies incomplete CareTasks.
3. System marks the CareTask as Missed.
4. System records MarkedMissedAt.
5. System makes Missed CareTask visible to CareCoordinator.
```

### Business Rules

```text
Missed is stronger than Overdue.
Missed means the task was not completed during the responsible shift.
Missed CareTasks require CareCoordinator review.
Missed CareTasks should not disappear from dashboard.
```

---

## UC-019: Review Missed CareTask

A CareCoordinator reviews a Missed CareTask and decides next action.

### Preconditions

```text
CareTask is Missed.
CareCoordinator has permission to review missed tasks.
```

### Main Flow

```text
1. CareCoordinator opens MissedCareTaskList.
2. CareCoordinator selects a Missed CareTask.
3. CareCoordinator reviews details, assignment, DueTime, notes, and history.
4. CareCoordinator decides next action:
   - create follow-up CareTask
   - cancel if no longer needed
   - mark for incident handling in future
5. System records the review action.
```

### Business Rules

```text
Missed CareTasks should require review.
Review should record who reviewed it and when.
A Missed CareTask may lead to follow-up action.
Repeated Missed CareTasks may later become incident or quality signals.
```

---

# 5. Cancellation and Reactivation Use Cases

---

## UC-020: Cancel CareTask

A CareCoordinator cancels a CareTask when it is no longer needed, duplicated, incorrect, or replaced by another task.

### Preconditions

```text
CareTask exists.
CareTask is not Completed.
CareTask is not Missed unless cancellation after review is allowed.
CareCoordinator is Creator or authorized CareCoordinator.
```

### Main Flow

```text
1. CareCoordinator opens CareTask.
2. CareCoordinator selects Cancel.
3. System asks for CancellationReason.
4. CareCoordinator provides reason.
5. System validates permission.
6. System changes status to Cancelled.
7. System records CancelledAt and CancelledBy.
```

### Business Rules

```text
Only Creator or authorized CareCoordinator can cancel a CareTask.
Cancellation requires a reason.
Cancelled CareTask cannot be completed.
Cancellation must be recorded in audit/history.
```

---

## UC-021: Reactivate Cancelled CareTask

A CareCoordinator reactivates a Cancelled CareTask when it was cancelled by mistake or becomes needed again.

### Preconditions

```text
CareTask exists.
CareTask is Cancelled.
CareCoordinator has permission to reactivate.
DueTime has not passed, or new DueTime is provided.
```

### Main Flow

```text
1. CareCoordinator opens Cancelled CareTask.
2. CareCoordinator selects Reactivate.
3. System checks whether reactivation is allowed.
4. System asks for reactivation reason if required.
5. System returns CareTask to Planned or Assigned status.
6. System records reactivation.
```

### Business Rules

```text
Reactivation is an action, not a status.
A CareTask should only be reactivated if it is still operationally valid.
If DueTime has passed, CareCoordinator should set a new DueTime or create follow-up CareTask.
Reactivation must be recorded in history.
```
---

## UC-022: Create Follow-Up CareTask

### Primary Actor

```text
CareCoordinator
```

### Goal

Create a new CareTask based on a previous unresolved or missed CareTask.

### Description

A CareCoordinator creates a follow-up CareTask when the original CareTask was Missed, UnableToComplete, or NeedAssistance and still requires action.

### Preconditions

```text
Original CareTask exists.
Original CareTask is Missed, UnableToComplete, NeedAssistance, or Cancelled with replacement.
CareCoordinator has permission to create follow-up task.
```

### Main Flow

```text
1. CareCoordinator opens original CareTask.
2. CareCoordinator selects Create Follow-Up.
3. System copies relevant details from original CareTask.
4. CareCoordinator adjusts DueTime, priority, assignment, and description.
5. System creates new CareTask.
6. System links the new CareTask to the original CareTask.
```

### Business Rules

```text
Follow-up CareTask should reference the original CareTask.
Follow-up CareTask should have its own lifecycle.
Original CareTask history must remain unchanged.
```

---

# 6. Dashboard and Monitoring Use Cases

---

## UC-023: View CareCoordinator Dashboard

A CareCoordinator views a dashboard showing the progress and status of CareTasks for the day, shift, unit, or facility.

### Preconditions

```text
CareCoordinator is authenticated.
CareCoordinator has dashboard access.
```

### Main Flow

```text
1. CareCoordinator opens dashboard.
2. System loads CareTask summary.
3. System shows counts by status.
4. System highlights Overdue, Missed, and NeedAssistance CareTasks.
5. CareCoordinator can open filtered lists.
```

### Business Rules

```text
Dashboard should show active operational risk clearly.
NeedAssistance CareTasks should be visible.
Overdue CareTasks should show overdue duration.
Missed CareTasks should require review.
```

---

## UC-024: View Today’s CareTaskList

A CareCoordinator views Today’s CareTaskList to understand all planned, assigned, completed, overdue, missed, and cancelled CareTasks.

### Preconditions

```text
CareCoordinator has access to Today’s CareTaskList.
```

### Main Flow

```text
1. CareCoordinator opens Today’s CareTaskList.
2. System shows all CareTasks for the selected day.
3. CareCoordinator filters by status, priority, Caregiver, Resident, Room, or Unit.
4. CareCoordinator opens CareTask details if needed.
```

### Business Rules

```text
Today’s CareTaskList should include Planned, Assigned, Completed, UnableToComplete, NeedAssistance, Overdue, Missed, and Cancelled CareTasks.
CareTasks should be filterable by operationally meaningful fields.
```
---

## UC-025: View Overdue CareTasks

A CareCoordinator views a filtered list of Overdue CareTasks.

### Preconditions

```text
There are Overdue CareTasks.
CareCoordinator has permission to view them.
```

### Main Flow

```text
1. CareCoordinator opens OverdueCareTaskList.
2. System shows Overdue CareTasks.
3. System displays DueTime and OverdueDuration.
4. CareCoordinator opens a CareTask.
5. CareCoordinator decides whether to reassign, contact Caregiver, cancel, or follow up.
```

### Business Rules

```text
Overdue CareTasks must show OverdueDuration.
High priority Overdue CareTasks should be highlighted.
Overdue CareTasks should remain visible until completed, cancelled, or missed.
```
---

## UC-026: View Need Assistance CareTasks

A CareCoordinator views CareTasks marked as NeedAssistance.

### Preconditions

```text
At least one CareTask is NeedAssistance.
CareCoordinator has permission to view it.
```

### Main Flow

```text
1. CareCoordinator opens NeedAssistanceList.
2. System shows CareTasks requiring assistance.
3. System displays Caregiver, reason, Resident/Room, priority, and DueTime.
4. CareCoordinator opens CareTask details.
5. CareCoordinator decides response.
```

### Business Rules

```text
NeedAssistance CareTasks should be visible immediately.
NeedAssistance should include reason when possible.
CareCoordinator response should be recorded if supported.
```

---

## UC-027: View Missed CareTasks

A CareCoordinator views Missed CareTasks that require review or follow-up.

### Preconditions

```text
There are Missed CareTasks.
CareCoordinator has permission to view missed tasks.
```

### Main Flow

```text
1. CareCoordinator opens MissedCareTaskList.
2. System shows Missed CareTasks.
3. System displays assigned Caregiver, DueTime, shift end time, Resident/Room, and priority.
4. CareCoordinator opens task details.
5. CareCoordinator reviews and selects next action.
```

### Business Rules

```text
Missed CareTasks should not disappear.
Missed CareTasks require review.
Missed CareTasks may lead to follow-up task or future incident workflow.
```
---

## UC-028: View Task Progress Summary

A Manager or CareCoordinator views summary information about CareTasks for a day, shift, unit, or facility.

### Preconditions

```text
Actor has dashboard or report access.
```

### Main Flow

```text
1. Actor opens TaskProgressSummary.
2. System displays total, completed, assigned, overdue, missed, unable to complete, and need assistance counts.
3. Actor filters by date, unit, shift, or Caregiver.
```

### Business Rules

```text
Summary numbers should match underlying CareTask data.
Manager may have read-only access.
TaskProgressSummary should support operational decision-making.
```
---

# 7. Audit and History Use Cases

---

## UC-029: View CareTask History

A CareCoordinator views the full history of status changes, assignments, updates, notes, and important events for a CareTask.
See what happened to a CareTask over time.

### Preconditions

```text
CareTask exists.
Actor has permission to view history.
```

### Main Flow

```text
1. Actor opens CareTask details.
2. Actor selects History.
3. System shows chronological history.
4. Actor reviews status changes, assignments, notes, and events.
```

### Business Rules

```text
History must be chronological.
History should include actor, timestamp, action, and relevant reason.
History should not be editable by normal users.
```

---

## UC-030: Record CareTask Audit Event

The system records audit events when important CareTask actions happen.
Record important CareTask actions for accountability.

### Main Flow

```text
1. User or system performs important CareTask action.
2. System creates audit event.
3. System records actor, timestamp, action type, and relevant details.
```

### Business Rules

```text
CareTaskCreated must be audited.
CareTaskAssigned must be audited.
CareTaskCompleted must be audited.
CareTaskCancelled must be audited.
CareTaskStatus changes must be audited.
Audit history should not be editable by normal users.
```

---

# 8. Validation and Supporting Use Cases

---

## UC-031: Validate Caregiver Eligibility for Assignment

### Primary Actor

```text
System
```

### Goal

Ensure CareTask is assigned only to an appropriate Caregiver.

### Description

Before assignment, the system checks whether the selected Caregiver is active and allowed to receive the CareTask.

### Preconditions

```text
CareCoordinator is assigning CareTask.
Selected Caregiver exists.
```

### Main Flow

```text
1. CareCoordinator selects Caregiver.
2. System checks Caregiver profile.
3. System verifies active status.
4. System verifies facility/unit permission if available.
5. System allows or rejects assignment.
```

### Business Rules

```text
Inactive Caregiver cannot receive new CareTasks.
Caregiver should belong to allowed facility or unit.
Eligibility check may depend on Caregiver Profile Management context.
```

### Result

```text
Caregiver assignment is either accepted or rejected.
```

---

## UC-032: Validate Resident Reference for CareTask

### Primary Actor

```text
System
```

### Goal

Ensure a CareTask references a valid Resident when applicable.

### Description

When a CareTask is linked to a Resident, the system validates that the Resident exists and is active.

### Preconditions

```text
CareCoordinator links CareTask to Resident.
Resident reference is provided.
```

### Main Flow

```text
1. CareCoordinator selects Resident.
2. System checks Resident Profile Management context.
3. System verifies Resident exists.
4. System verifies Resident is active.
5. System allows or rejects the reference.
```

### Business Rules

```text
Inactive Resident should not be selected for new active CareTasks by default.
CareTask should not own full Resident profile.
CareTask may store ResidentReference, not full Resident data.
```

### Result

```text
CareTask has valid ResidentReference.
```

---

## UC-033: Validate CareTask Status Transition

### Primary Actor

```text
System
```

### Goal

Prevent invalid CareTask lifecycle changes.

### Description

The system checks whether a requested status change is allowed according to CareTask business rules.

### Preconditions

```text
A CareTask status change is requested.
```

### Main Flow

```text
1. Actor requests CareTask status change.
2. System reads current status.
3. System checks requested target status.
4. System validates transition rules.
5. System either applies or rejects the transition.
```

### Business Rules

```text
Draft can become Planned.
Planned can become Assigned or Cancelled.
Assigned can become Completed, UnableToComplete, NeedAssistance, Overdue, or Cancelled.
Overdue can become Completed, UnableToComplete, NeedAssistance, Missed, or Cancelled.
Cancelled cannot become Completed.
Completed should be final.
Missed requires review before follow-up or reactivation.
```

### Result

```text
Only valid status transitions are allowed.
```

---


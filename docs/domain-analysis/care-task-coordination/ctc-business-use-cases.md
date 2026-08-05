# CareTaskCoordination Bounded Context: Business Use Cases

## Bounded Context

```text
CareTaskCoordination
```

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
10. Optional / Future Use Cases
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
9. System records CareTaskCreated event.
```

### Business Rules

```text
A CareTask must have a title.
A published CareTask must have a DueTime.
A published CareTask must have a TaskPriority.
A CareTask may be linked to a Resident, Room, or Location.
A CareTask must have a Creator.
```

### Result

```text
A new CareTask exists in Draft or Planned status.
```

### Possible Domain Events

```text
CareTaskCreated
```

---

## UC-002: Save CareTask as Draft

### Primary Actor

```text
CareCoordinator
```

### Goal

Save an incomplete CareTask without making it active for today.

### Description

A CareCoordinator may create a CareTask but save it as Draft if it is not ready to be added to Today’s CareTaskList.

### Preconditions

```text
CareCoordinator is authenticated.
CareCoordinator has permission to create CareTasks.
```

### Main Flow

```text
1. CareCoordinator creates a CareTask.
2. CareCoordinator enters minimum draft information.
3. CareCoordinator saves the CareTask as Draft.
4. System stores the CareTask in Draft status.
```

### Business Rules

```text
Draft CareTask may have missing assignment.
Draft CareTask may have incomplete details depending on validation rules.
Draft CareTask is not visible in Caregiver My Tasks.
Draft CareTask is not counted as active daily work.
```

### Result

```text
CareTask is saved as Draft.
```

### Possible Domain Events

```text
CareTaskCreated
CareTaskSavedAsDraft
```

---

## UC-003: Add CareTask to Today’s CareTaskList

### Primary Actor

```text
CareCoordinator
```

### Goal

Make a CareTask part of today’s operational care work.

### Description

A CareCoordinator adds a CareTask to Today’s CareTaskList so that it becomes part of the day’s planned care workload.

### Preconditions

```text
CareTask exists.
CareTask is not Cancelled.
CareTask has required published details.
```

### Main Flow

```text
1. CareCoordinator selects a Draft CareTask or creates a new CareTask.
2. CareCoordinator confirms required details.
3. CareCoordinator adds the CareTask to Today’s CareTaskList.
4. System changes CareTask status to Planned.
5. System records when it was added.
```

### Business Rules

```text
Only valid CareTasks can be added to Today’s CareTaskList.
A CareTask in Today’s CareTaskList should have DueTime and TaskPriority.
A Planned CareTask may still be unassigned.
```

### Result

```text
CareTask becomes Planned.
```

### Possible Domain Events

```text
CareTaskAddedToTodayList
```

---

## UC-004: Update CareTask Details

### Primary Actor

```text
CareCoordinator
```

### Goal

Modify CareTask information before it is completed or closed.

### Description

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

### Result

```text
CareTask details are updated.
```

### Possible Domain Events

```text
CareTaskDetailsUpdated
CareTaskLateChangeRecorded
```

---

## UC-005: Change CareTask Priority

### Primary Actor

```text
CareCoordinator
```

### Goal

Change the urgency or importance of a CareTask.

### Description

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

### Result

```text
CareTask has updated priority.
```

### Possible Domain Events

```text
CareTaskPriorityChanged
```

---

## UC-006: Change CareTask DueTime

### Primary Actor

```text
CareCoordinator
```

### Goal

Change when a CareTask should be completed.

### Description

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
DueTime should not be in the past unless explicitly allowed.
Late DueTime changes require a reason.
Changing DueTime may affect Overdue status.
```

### Result

```text
CareTask has updated DueTime.
```

### Possible Domain Events

```text
CareTaskDueTimeChanged
CareTaskLateChangeRecorded
```

---

# 2. CareTask Assignment Use Cases

---

## UC-007: Assign CareTask to Caregiver

### Primary Actor

```text
CareCoordinator
```

### Goal

Assign responsibility for a CareTask to a Caregiver.

### Description

A CareCoordinator assigns a Planned CareTask to a specific Caregiver so that the Caregiver becomes responsible for completing it.

### Preconditions

```text
CareTask exists.
CareTask is Planned or assignable.
Caregiver exists.
Caregiver is active.
Caregiver is allowed to work in the relevant facility or unit.
```

### Main Flow

```text
1. CareCoordinator opens a Planned CareTask.
2. CareCoordinator selects a Caregiver.
3. System validates Caregiver eligibility.
4. System assigns the CareTask.
5. System changes CareTask status to Assigned.
6. System records assignment time.
7. CareTask appears in Caregiver My Tasks.
```

### Business Rules

```text
A CareTask can be assigned only to an active Caregiver.
A CareTask should not be assigned to a Caregiver outside the allowed facility or unit.
Completed, Missed, or Cancelled CareTasks cannot be assigned.
Assignment must be recorded in history.
```

### Result

```text
CareTask is Assigned to a Caregiver.
```

### Possible Domain Events

```text
CareTaskAssigned
```

---

## UC-008: Reassign CareTask to Another Caregiver

### Primary Actor

```text
CareCoordinator
```

### Goal

Transfer responsibility for a CareTask to another Caregiver.

### Description

A CareCoordinator reassigns a CareTask when the original Caregiver is unavailable, overloaded, or no longer the right person to complete it.

### Preconditions

```text
CareTask exists.
CareTask is Assigned, Overdue, NeedAssistance, or UnableToComplete if reassignment is allowed.
CareTask is not Completed.
CareTask is not Cancelled.
New Caregiver is active and eligible.
```

### Main Flow

```text
1. CareCoordinator opens the assigned CareTask.
2. CareCoordinator selects Reassign.
3. CareCoordinator selects another Caregiver.
4. System validates the new Caregiver.
5. System changes AssignedCaregiver.
6. System records reassignment.
7. New Caregiver sees the CareTask in My Tasks.
```

### Business Rules

```text
Completed CareTasks cannot be reassigned.
Cancelled CareTasks cannot be reassigned.
Missed CareTasks should require review before reassignment.
Reassignment must be recorded in history.
Reassignment close to DueTime may require a reason.
```

### Result

```text
CareTask is assigned to a new Caregiver.
```

### Possible Domain Events

```text
CareTaskReassigned
```

---

## UC-009: Unassign CareTask

### Primary Actor

```text
CareCoordinator
```

### Goal

Remove the current Caregiver assignment from a CareTask.

### Description

A CareCoordinator removes the assigned Caregiver from a CareTask, returning it to Planned status.

### Preconditions

```text
CareTask exists.
CareTask is Assigned.
CareTask is not Completed.
CareTask is not Cancelled.
CareCoordinator has permission to unassign.
```

### Main Flow

```text
1. CareCoordinator opens the assigned CareTask.
2. CareCoordinator selects Unassign.
3. System removes AssignedCaregiver.
4. System changes status to Planned.
5. System records the unassignment.
```

### Business Rules

```text
Completed CareTasks cannot be unassigned.
Cancelled CareTasks cannot be unassigned.
Unassignment close to DueTime may require a reason.
```

### Result

```text
CareTask becomes Planned and unassigned.
```

### Possible Domain Events

```text
CareTaskUnassigned
```

---

# 3. Caregiver Task Execution Use Cases

---

## UC-010: View My Tasks

### Primary Actor

```text
Caregiver
```

### Goal

See assigned CareTasks for the current shift or day.

### Description

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

### Result

```text
Caregiver sees assigned CareTasks.
```

---

## UC-011: View CareTask Details

### Primary Actor

```text
Caregiver
```

### Goal

Understand what needs to be done for a CareTask.

### Description

A Caregiver opens a CareTask to see full details before performing the care activity.

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

### Result

```text
Caregiver understands the assigned CareTask.
```

---

## UC-012: Complete CareTask

### Primary Actor

```text
Caregiver
```

### Goal

Mark an assigned CareTask as completed.

### Description

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

### Result

```text
CareTask status becomes Completed.
```

### Possible Domain Events

```text
CareTaskCompleted
```

---

## UC-013: Mark CareTask as UnableToComplete

### Primary Actor

```text
Caregiver
```

### Goal

Report that a CareTask cannot be completed.

### Description

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

### Result

```text
CareTask status becomes UnableToComplete.
```

### Possible Domain Events

```text
CareTaskMarkedUnableToComplete
```

---

## UC-014: Request Assistance for CareTask

### Primary Actor

```text
Caregiver
```

### Goal

Ask for help with a CareTask.

### Description

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

### Result

```text
CareTask status becomes NeedAssistance.
```

### Possible Domain Events

```text
CareTaskAssistanceRequested
```

---

## UC-015: Add CareTask Note

### Primary Actor

```text
Caregiver or CareCoordinator
```

### Goal

Add relevant context to a CareTask.

### Description

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

### Result

```text
CareTask has a new note.
```

### Possible Domain Events

```text
CareTaskNoteAdded
```

---

# 4. Status and Lifecycle Management Use Cases

---

## UC-016: Mark CareTask as Overdue

### Primary Actor

```text
System
```

### Goal

Automatically identify CareTasks that have passed DueTime.

### Description

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

### Result

```text
CareTask status becomes Overdue.
```

### Possible Domain Events

```text
CareTaskBecameOverdue
```

---

## UC-017: Calculate Overdue Duration

### Primary Actor

```text
System
```

### Goal

Show how long a CareTask has been overdue.

### Description

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

### Result

```text
Dashboard shows overdue duration.
```

---

## UC-018: Mark CareTask as Missed

### Primary Actor

```text
System
```

### Goal

Identify CareTasks not completed during the assigned Caregiver’s shift.

### Description

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

### Result

```text
CareTask status becomes Missed.
```

### Possible Domain Events

```text
CareTaskMarkedMissed
```

---

## UC-019: Review Missed CareTask

### Primary Actor

```text
CareCoordinator
```

### Goal

Decide what to do after a CareTask was missed.

### Description

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
   - reassign if still valid
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

### Result

```text
Missed CareTask is reviewed and follow-up decision is recorded.
```

### Possible Domain Events

```text
MissedCareTaskReviewed
CareTaskFollowUpRequested
```

---

# 5. Cancellation and Reactivation Use Cases

---

## UC-020: Cancel CareTask

### Primary Actor

```text
CareCoordinator
```

### Goal

Cancel a CareTask that should no longer be completed.

### Description

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

### Result

```text
CareTask status becomes Cancelled.
```

### Possible Domain Events

```text
CareTaskCancelled
```

---

## UC-021: Reactivate Cancelled CareTask

### Primary Actor

```text
CareCoordinator
```

### Goal

Restore a Cancelled CareTask if it becomes valid again.

### Description

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

### Result

```text
CareTask returns to Planned or Assigned status.
```

### Possible Domain Events

```text
CareTaskReactivated
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

### Result

```text
New follow-up CareTask is created.
```

### Possible Domain Events

```text
FollowUpCareTaskCreated
```

---

# 6. Dashboard and Monitoring Use Cases

---

## UC-023: View CareCoordinator Dashboard

### Primary Actor

```text
CareCoordinator
```

### Goal

Monitor the current state of care work.

### Description

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

### Result

```text
CareCoordinator understands current CareTask situation.
```

---

## UC-024: View Today’s CareTaskList

### Primary Actor

```text
CareCoordinator
```

### Goal

See all CareTasks planned for today.

### Description

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

### Result

```text
CareCoordinator can manage daily care workload.
```

---

## UC-025: View Overdue CareTasks

### Primary Actor

```text
CareCoordinator
```

### Goal

Identify CareTasks that are late.

### Description

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

### Result

```text
CareCoordinator can act on overdue work.
```

---

## UC-026: View Need Assistance CareTasks

### Primary Actor

```text
CareCoordinator
```

### Goal

See which Caregivers need help.

### Description

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

### Result

```text
CareCoordinator can respond to assistance needs.
```

---

## UC-027: View Missed CareTasks

### Primary Actor

```text
CareCoordinator
```

### Goal

Review tasks that were not completed during the responsible shift.

### Description

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

### Result

```text
CareCoordinator can review and respond to Missed CareTasks.
```

---

## UC-028: View Task Progress Summary

### Primary Actor

```text
Manager
```

### Goal

Understand overall progress of care work.

### Description

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

### Result

```text
Actor understands care task progress.
```

---

# 7. Audit and History Use Cases

---

## UC-029: View CareTask History

### Primary Actor

```text
CareCoordinator
```

### Goal

See what happened to a CareTask over time.

### Description

A CareCoordinator views the full history of status changes, assignments, updates, notes, and important events for a CareTask.

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

### Result

```text
Actor can understand CareTask lifecycle.
```

---

## UC-030: Record CareTask Audit Event

### Primary Actor

```text
System
```

### Goal

Record important CareTask actions for accountability.

### Description

The system records audit events when important CareTask actions happen.

### Preconditions

```text
A CareTask action occurs.
```

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

### Result

```text
CareTask action is recorded for accountability.
```

### Possible Domain Events

```text
CareTaskAuditEventRecorded
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

# 9. Optional / Future Use Cases

These may not be MVP, but they are useful to keep for later.

---

## UC-034: Assign CareTask to Team

### Primary Actor

```text
CareCoordinator
```

### Goal

Assign a CareTask to a team instead of one Caregiver.

### Description

Some CareTasks may be assigned to a team or group when individual assignment is not practical.

### MVP Status

```text
Future
```

---

## UC-035: Accept CareTask Assignment

### Primary Actor

```text
Caregiver
```

### Goal

Allow Caregiver to confirm they accept responsibility.

### Description

The Caregiver explicitly accepts an assigned CareTask before working on it.

### MVP Status

```text
Future
```

---

## UC-036: Start CareTask

### Primary Actor

```text
Caregiver
```

### Goal

Mark a CareTask as started or in progress.

### Description

The Caregiver marks the CareTask as InProgress before completing it.

### MVP Status

```text
Optional / Future
```

---

## UC-037: Pause CareTask

### Primary Actor

```text
Caregiver
```

### Goal

Temporarily pause a CareTask because work cannot continue immediately.

### MVP Status

```text
Future
```

---

## UC-038: Escalate High Priority Overdue CareTask

### Primary Actor

```text
System
```

### Goal

Notify or highlight CareTasks that are high priority and overdue.

### MVP Status

```text
Future / Phase 2
```

---

## UC-039: Create Incident from Missed CareTask

### Primary Actor

```text
CareCoordinator
```

### Goal

Convert serious or repeated missed care work into an incident record.

### MVP Status

```text
Future / Incident Management Context
```

---

## UC-040: Create Recurring CareTask from Completed CareTask

### Primary Actor

```text
CareCoordinator
```

### Goal

Turn a repeated care responsibility into a recurring routine.

### MVP Status

```text
Future / Routine Planning Context
```

---

# Recommended MVP Use Cases

For the first MVP, the recommended focus is:

```text
UC-001: Create CareTask
UC-003: Add CareTask to Today’s CareTaskList
UC-004: Update CareTask Details
UC-007: Assign CareTask to Caregiver
UC-008: Reassign CareTask to Another Caregiver
UC-010: View My Tasks
UC-011: View CareTask Details
UC-012: Complete CareTask
UC-013: Mark CareTask as UnableToComplete
UC-014: Request Assistance for CareTask
UC-016: Mark CareTask as Overdue
UC-017: Calculate Overdue Duration
UC-018: Mark CareTask as Missed
UC-020: Cancel CareTask
UC-021: Reactivate Cancelled CareTask
UC-023: View CareCoordinator Dashboard
UC-024: View Today’s CareTaskList
UC-025: View Overdue CareTasks
UC-026: View Need Assistance CareTasks
UC-027: View Missed CareTasks
UC-029: View CareTask History
UC-033: Validate CareTask Status Transition
```

---

# Suggested Documentation Structure

You can document them later like this:

```text
docs/
  domain-analysis/
    care-task-coordination/
      use-cases/
        README.md
        UC-001-create-care-task.md
        UC-002-save-care-task-as-draft.md
        UC-003-add-care-task-to-today-list.md
        UC-004-update-care-task-details.md
        UC-007-assign-care-task.md
        UC-012-complete-care-task.md
        UC-013-mark-unable-to-complete.md
        UC-014-request-assistance.md
        UC-016-mark-overdue.md
        UC-018-mark-missed.md
        UC-020-cancel-care-task.md
        UC-021-reactivate-care-task.md
        UC-023-view-dashboard.md
```

Or if you prefer fewer files at first:

```text
docs/
  domain-analysis/
    care-task-coordination/
      use-cases.md
```

For now, it is recommended to keep these use cases in one `use-cases.md` file. Later, when they become stable, they can be split into separate files.

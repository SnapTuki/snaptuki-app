# Ubiquitous Language: Care Task Coordination

## 1. Purpose

This document defines the Ubiquitous Language for the **Care Task Coordination** bounded context in Snaptuki.

The purpose of this bounded context is to coordinate daily care responsibilities inside a nursing home. It helps CareCoordinators create, plan, assign, monitor, and follow up CareTasks, while Caregivers can clearly see what they need to do and report the result of their work.

This language should be used consistently in:

- conversations with domain experts
- user stories
- documentation
- diagrams
- tests
- API names where appropriate
- domain model names
- code where appropriate

The goal is to avoid generic task-management language and instead use terminology that reflects the nursing home care domain.

---

## 2. Bounded Context Name

```text
Care Task Coordination
```

## 3. Core Domain Purpose

The Care Task Coordination context answers the following business questions:

1. What care work needs to be done?
2. Who is responsible for doing it?
3. For which resident, room, or location?
4. When should it be completed?
5. Has it been completed?
6. Is it delayed, overdue, missed, or blocked?
7. Does the Caregiver need assistance?
8. What should the CareCoordinator see in the dashboard?

---

## 4. Primary Actors

## CareCoordinator

A staff member responsible for planning, creating, assigning, monitoring, cancelling, and reviewing CareTasks.

A CareCoordinator may be a nurse in charge, senior caregiver, team leader, or another responsible staff member depending on the nursing home’s operational structure.

### Responsibilities

- Create CareTasks.
- Add CareTasks to Today’s CareTaskList.
- Assign CareTasks to Caregivers.
- Update CareTask details when allowed.
- Monitor CareTask progress.
- Review Overdue and Missed CareTasks.
- Cancel CareTasks when necessary.
- Reactivate Cancelled CareTasks when appropriate.
- Respond to NeedAssistance cases.

### Example sentence

```text
The CareCoordinator assigns the morning hygiene CareTask to Maria.
```

---

## Caregiver

A staff member responsible for completing assigned CareTasks.

A Caregiver receives CareTasks in My Tasks and updates the task status based on what happened during care work.

### Responsibilities

- View assigned CareTasks.
- Open CareTask details.
- Complete assigned CareTasks.
- Mark a CareTask as UnableToComplete when it cannot be done.
- Mark a CareTask as NeedAssistance when help is required.
- Add notes or reasons when required.

### Example sentence

```text
The Caregiver completes the hydration check CareTask.
```

---

## Resident

A person living in the nursing home who receives care.

In this bounded context, Resident is usually referenced only as the person connected to a CareTask. The full Resident profile belongs to the Resident Profile Management supporting subdomain.

### Important distinction

The Care Task Coordination context should not own the full medical or personal record of a Resident. It should only use the resident information required for task coordination.

### Example sentence

```text
The CareTask is linked to Resident Anna Virtanen in room 204.
```

---

## 5. Main Domain Concepts

## CareTask

A care-related responsibility that should be completed by a Caregiver or care team.

A CareTask is not a generic task. It is a care operation item connected to nursing home work. It may be linked to a Resident, Room, Location, Caregiver, due time, priority, and status.

### Examples

- Morning hygiene support
- Meal assistance
- Hydration check
- Mobility support
- Room safety check
- Resident activity support
- Medication-related reminder
- Evening routine support

### Required information for a published CareTask

- title
- due time
- priority
- creator
- status

### Optional information

- description
- resident reference
- room reference
- location reference
- assigned Caregiver
- note
- delay/unable reason

### Example sentence

```text
The CareCoordinator creates a CareTask for Anna’s morning hygiene support.
```

---

## CareTask Title

A short name describing the care responsibility.

### Examples

```text
Morning hygiene support
Meal assistance
Hydration check
Safety round
Mobility support
```

### Rule

The title must be clear enough for a Caregiver to understand the purpose of the CareTask quickly.

---

## CareTask Description

Additional details explaining what should be done.

### Example

```text
Assist the resident with morning hygiene and ensure the call bell is reachable before leaving the room.
```

### Rule

The description should be practical and short. It should not contain unnecessary sensitive medical information.

---

## CareTask Details

The information that describes a CareTask.

CareTask Details may include:

- title
- description
- Resident reference
- Room reference
- Location reference
- due time
- priority
- assignment
- notes

### Example sentence

```text
The CareCoordinator updates the CareTask details before the due time.
```

---

## Today’s CareTaskList

The list of CareTasks planned for the current day or current operational period.

A CareTask may exist as a draft before it is added to Today’s CareTaskList.

### Purpose

Today’s CareTaskList helps CareCoordinators plan and monitor the day’s care work.

### Example sentence

```text
The CareCoordinator adds the hydration check to Today’s CareTaskList.
```

---

## My Tasks

The Caregiver’s personal view of assigned CareTasks.

### Purpose

My Tasks helps a Caregiver see what they are responsible for during their shift.

### Example sentence

```text
The Caregiver opens My Tasks and sees three assigned CareTasks.
```

---

## CareAssignment

The assignment of a CareTask to a specific Caregiver.

A CareTask may be unassigned when it is still planned, but it should be assigned before a Caregiver is expected to complete it.

### Example sentence

```text
The CareAssignment connects the CareTask to Caregiver Maria.
```

---

## AssignedCaregiver

The Caregiver currently responsible for completing a CareTask.

### Rule

Only the assigned Caregiver should normally complete the CareTask unless the nursing home allows another authorized staff member to complete it.

### Example sentence

```text
The AssignedCaregiver marks the CareTask as Completed.
```

---

## Creator

The CareCoordinator who originally created the CareTask.

### Rule

The Creator may have special permissions, such as cancelling or editing the CareTask, depending on business rules.

### Example sentence

```text
Only the Creator or an authorized CareCoordinator can cancel the CareTask.
```

---

## DueTime

The time by which a CareTask should be completed.

### Example

```text
2026-07-25 09:00
```

### Rule

A published CareTask must have a DueTime.

### Example sentence

```text
The CareTask has a DueTime of 09:00.
```

---

## Deadline

A business-friendly word for DueTime.

In this bounded context, **DueTime** is preferred in the domain model, while **deadline** may be used in user interface text.

### Example

```text
UI label: Deadline
Domain term: DueTime
```

---

## TaskPriority

The importance or urgency level of a CareTask.

### Suggested values

```text
Low
Normal
High
Critical
```

### Meaning

- `Low`: Should be done, but not urgent.
- `Normal`: Standard care task.
- `High`: Important and should be prioritized.
- `Critical`: Requires urgent attention.

### Example sentence

```text
The CareCoordinator sets the CareTask priority to High.
```

---

## CareTaskStatus

The current state of a CareTask.

A CareTask has one current status at a time.

### Suggested statuses

```text
Planned
Assigned
Completed
UnableToComplete
NeedAssistance
Overdue
Missed
Cancelled
```

---

# 7. Actions / Commands

Commands represent user or system intentions. They are written as verbs.

## CreateCareTask

A CareCoordinator creates a new CareTask.

### Actor

CareCoordinator

### Result

CareTask is created.

### Possible event

```text
CareTaskCreated
```

---

## AddCareTaskToTodayList

A CareCoordinator adds a CareTask to Today’s CareTaskList.

### Actor

CareCoordinator

### Result

CareTask becomes Planned.

### Possible event

```text
CareTaskAddedToTodayList
```

---

## AssignCareTask

A CareCoordinator assigns a CareTask to a Caregiver.

### Actor

CareCoordinator

### Result

CareTask becomes Assigned.

### Possible event

```text
CareTaskAssigned
```

---

## UpdateCareTaskDetails

A CareCoordinator updates the details of a CareTask.

### Actor

CareCoordinator

### Result

CareTask details are changed.

### Possible event

```text
CareTaskDetailsUpdated
```

### Rule

If the update happens less than 15 minutes before DueTime, the system should require a reason and record it as a late change.

---

## CompleteCareTask

A Caregiver marks an assigned CareTask as Completed.

### Actor

Caregiver

### Result

CareTask becomes Completed.

### Possible event

```text
CareTaskCompleted
```

---

## MarkCareTaskUnableToComplete

A Caregiver marks a CareTask as UnableToComplete.

### Actor

Caregiver

### Result

CareTask becomes UnableToComplete.

### Possible event

```text
CareTaskMarkedUnableToComplete
```

### Rule

A reason is required.

---

## RequestAssistanceForCareTask

A Caregiver marks a CareTask as NeedAssistance.

### Actor

Caregiver

### Result

CareTask becomes NeedAssistance.

### Possible event

```text
CareTaskAssistanceRequested
```

---

## MarkCareTaskOverdue

The system marks a CareTask as Overdue after the DueTime passes.

### Actor

System

### Result

CareTask becomes Overdue.

### Possible event

```text
CareTaskBecameOverdue
```

---

## MarkCareTaskMissed

The system marks a CareTask as Missed after the assigned Caregiver’s shift ends and the CareTask remains incomplete.

### Actor

System

### Result

CareTask becomes Missed.

### Possible event

```text
CareTaskMarkedMissed
```

---

## CancelCareTask

The Creator or authorized CareCoordinator cancels a CareTask.

### Actor

Creator or authorized CareCoordinator

### Result

CareTask becomes Cancelled.

### Possible event

```text
CareTaskCancelled
```

### Rule

A cancellation reason is required.

---

## ReactivateCareTask

An authorized CareCoordinator reactivates a Cancelled CareTask.

### Actor

CareCoordinator

### Result

CareTask returns to Planned or Assigned status.

### Possible event

```text
CareTaskReactivated
```

### Important distinction

Reactivated is not a CareTaskStatus. It is an action/event.

---

# 8. Domain Events

Domain events describe something important that has already happened.

## CareTaskCreated

A CareCoordinator created a CareTask.

---

## CareTaskAddedToTodayList

A CareTask was added to Today’s CareTaskList.

---

## CareTaskAssigned

A CareTask was assigned to a Caregiver.

---

## CareTaskDetailsUpdated

The details of a CareTask were changed.

---

## CareTaskCompleted

A Caregiver completed a CareTask.

---

## CareTaskMarkedUnableToComplete

A Caregiver reported that a CareTask could not be completed.

---

## CareTaskAssistanceRequested

A Caregiver requested assistance for a CareTask.

---

## CareTaskBecameOverdue

A CareTask passed its DueTime without being completed.

---

## CareTaskMarkedMissed

A CareTask remained incomplete when the assigned Caregiver’s shift ended.

---

## CareTaskCancelled

A CareTask was cancelled by the Creator or an authorized CareCoordinator.

---

## CareTaskReactivated

A Cancelled CareTask was reactivated by an authorized CareCoordinator.

---

# 9. Reasons

## DelayReason

A reason explaining why a CareTask was delayed or not completed on time.

For MVP, DelayReason may be used when a CareTask becomes UnableToComplete or when a late update happens.

### Suggested values

```text
ResidentSleeping
ResidentRefused
NeedNurseSupport
NeedAnotherCaregiver
EquipmentMissing
NotEnoughTime
ResidentUnavailable
InstructionUnclear
Other
```

---

## CancellationReason

A reason explaining why a CareTask was cancelled.

### Suggested values

```text
NoLongerNeeded
DuplicateCareTask
CreatedByMistake
ResidentUnavailable
ReplacedByAnotherCareTask
CarePlanChanged
Other
```

---

## LateChangeReason

A reason required when CareTask details are updated close to DueTime.

### Suggested values

```text
ResidentConditionChanged
CarePriorityChanged
WrongInformationCorrected
CaregiverAvailabilityChanged
RoomOrLocationChanged
Other
```

---

## AssistanceReason

A reason explaining why a Caregiver needs help.

### Suggested values

```text
NeedAnotherCaregiver
NeedNurseSupport
ResidentDistressed
ResidentAggressive
EquipmentNeeded
InstructionUnclear
SafetyConcern
Other
```

---

# 10. Time-Related Terms

## CreatedAt

The time when the CareTask was created.

---

## AddedToTodayListAt

The time when the CareTask was added to Today’s CareTaskList.

---

## AssignedAt

The time when the CareTask was assigned to a Caregiver.

---

## DueTime

The time by which the CareTask should be completed.

---

## CompletedAt

The time when the CareTask was completed.

---

## CancelledAt

The time when the CareTask was cancelled.

---

## BecameOverdueAt

The time when the CareTask became Overdue.

---

## MarkedMissedAt

The time when the CareTask became Missed.

---

## OverdueDuration

The amount of time between DueTime and the current time, if the CareTask is Overdue.

### Example

```text
OverdueDuration = currentTime - dueTime
```

---

# 11. Dashboard Terms

## CareCoordinatorDashboard

The view used by CareCoordinators to monitor CareTask progress.

### Shows

- total CareTasks today
- Planned CareTasks
- Assigned CareTasks
- Completed CareTasks
- UnableToComplete CareTasks
- NeedAssistance CareTasks
- Overdue CareTasks
- Missed CareTasks
- Cancelled CareTasks

---

## TaskProgressSummary

A summary of CareTask statuses for a selected day, shift, unit, or Caregiver.

### Example

```text
Total: 42
Completed: 30
Assigned: 6
Need Assistance: 2
Overdue: 3
Missed: 1
```

---

## OverdueCareTaskList

A filtered list of CareTasks that are currently Overdue.

---

## MissedCareTaskList

A filtered list of CareTasks that became Missed and require review.

---

## NeedAssistanceList

A filtered list of CareTasks where Caregivers requested assistance.

---

# 12. Business Rules

## Creation Rules

1. Only a CareCoordinator can create a CareTask.
2. A CareTask must have a title.
3. A published CareTask must have a DueTime.
4. A published CareTask must have a TaskPriority.
5. A CareTask may be linked to a Resident, Room, or Location.

---

## Planning Rules

1. A CareTask can be saved as Draft.
2. A CareTask becomes Planned when it is added to Today’s CareTaskList.
3. A Planned CareTask may be unassigned.
4. A Planned CareTask should be assigned before it is expected to be completed.

---

## Assignment Rules

1. A CareTask can be assigned to a Caregiver.
2. A CareTask should not be assigned to an inactive Caregiver.
3. A CareTask should not be assigned to a Caregiver outside the allowed Facility or Unit.
4. A Completed, Missed, or Cancelled CareTask cannot be assigned again without special reactivation or follow-up logic.
5. Reassignment should be recorded in the audit trail.

---

## Completion Rules

1. A Caregiver can complete an assigned CareTask.
2. Completion records who completed the CareTask and when.
3. A Cancelled CareTask cannot be completed.
4. A Missed CareTask cannot be completed unless it is reactivated or replaced by a follow-up CareTask.
5. If a CareTask is completed after DueTime, it is considered completed late.

---

## UnableToComplete Rules

1. A Caregiver can mark an assigned CareTask as UnableToComplete.
2. UnableToComplete requires a reason.
3. UnableToComplete CareTasks should be visible to the CareCoordinator.
4. A CareCoordinator should review UnableToComplete CareTasks.

---

## NeedAssistance Rules

1. A Caregiver can request assistance for an assigned CareTask.
2. NeedAssistance should be visible immediately in the CareCoordinatorDashboard.
3. A CareCoordinator may respond by reassigning the task, contacting another staff member, or adding a note.
4. A NeedAssistance CareTask may later become Completed, UnableToComplete, Overdue, Missed, or Cancelled.

---

## Overdue Rules

1. A CareTask becomes Overdue when the DueTime passes and it has not been Completed, Cancelled, or Missed.
2. OverdueDuration should be shown in minutes and hours.
3. Overdue CareTasks should be visible in the CareCoordinatorDashboard.
4. An Overdue CareTask can still be Completed if the shift has not ended and the task is still valid.

---

## Missed Rules

1. A CareTask becomes Missed if it remains incomplete when the assigned Caregiver’s working shift ends.
2. Missed CareTasks require CareCoordinator review.
3. A Missed CareTask should not disappear from the dashboard.
4. A Missed CareTask may lead to a follow-up CareTask or incident handling in future versions.

---

## Cancellation Rules

1. A CareTask can be cancelled only by the Creator or an authorized CareCoordinator.
2. Cancellation requires a reason.
3. A Cancelled CareTask cannot be completed.
4. Cancellation is recorded in the audit trail.
5. A Cancelled CareTask may be reactivated only if allowed by business rules.

---

## Reactivation Rules

1. Reactivation is an action, not a status.
2. A Cancelled CareTask may be reactivated by an authorized CareCoordinator.
3. A CareTask should only be reactivated if the DueTime has not passed.
4. Reactivating a CareTask returns it to Planned or Assigned status.
5. Reactivation is recorded in the audit trail.

---

## Late Change Rules

1. CareTask details may be updated before DueTime.
2. If CareTask details are updated less than 15 minutes before DueTime, a LateChangeReason is required.
3. Late changes must be recorded in the audit trail.
4. Late changes should be visible to the AssignedCaregiver if they affect the task.

---

# 14. Example Sentences Using the Ubiquitous Language

```text
The CareCoordinator creates a CareTask for morning hygiene support.
```

```text
The CareCoordinator adds the CareTask to Today’s CareTaskList.
```

```text
The CareCoordinator assigns the CareTask to Caregiver Maria.
```

```text
The Caregiver sees the CareTask in My Tasks.
```

```text
The Caregiver marks the CareTask as Completed.
```

```text
The Caregiver marks the CareTask as UnableToComplete because the Resident refused.
```

```text
The Caregiver marks the CareTask as NeedAssistance because another Caregiver is required.
```

```text
The CareTask becomes Overdue when the DueTime passes.
```

```text
The CareTask becomes Missed when the assigned Caregiver’s shift ends and the CareTask is still incomplete.
```

```text
The CareCoordinator cancels the CareTask with a CancellationReason.
```

```text
The CareCoordinator reactivates the Cancelled CareTask, and the CareTask returns to Planned status.
```

---

# 15. Suggested Code Naming Alignment

The Ubiquitous Language should influence code names.

## Domain entities or aggregates

```text
CareTask
CareAssignment
```

## Value objects

```text
DueTime
TaskPriority
DelayReason
CancellationReason
LateChangeReason
AssistanceReason
```

## Enums

```text
CareTaskStatus
TaskPriority
```

## Commands

```text
CreateCareTask
AddCareTaskToTodayList
AssignCareTask
UpdateCareTaskDetails
CompleteCareTask
MarkCareTaskUnableToComplete
RequestAssistanceForCareTask
CancelCareTask
ReactivateCareTask
```

## Events

```text
CareTaskCreated
CareTaskAddedToTodayList
CareTaskAssigned
CareTaskDetailsUpdated
CareTaskCompleted
CareTaskMarkedUnableToComplete
CareTaskAssistanceRequested
CareTaskBecameOverdue
CareTaskMarkedMissed
CareTaskCancelled
CareTaskReactivated
```

---

# 16. Open Questions

The following questions should be answered through domain discovery and pilot feedback.

## Assignment

1. Can a CareTask be assigned to more than one Caregiver?
2. Can a CareTask be assigned to a team instead of an individual Caregiver?
3. Can another Caregiver complete a CareTask assigned to someone else?

## Missed CareTasks

1. Can a Missed CareTask be reactivated?
2. Should a Missed CareTask automatically create a follow-up CareTask?
3. Should repeated Missed CareTasks create an incident in the future Incident Management context?

## Cancellation

1. Should cancellation be allowed after DueTime?
2. Should managers override cancellation restrictions?
3. Should all cancellations require approval?

## Late Changes

1. Is 15 minutes the correct threshold?
2. Should each nursing home configure the late-change threshold?
3. Should AssignedCaregivers be notified immediately when CareTask details change?

## Assistance

1. Who should be notified when a CareTask becomes NeedAssistance?
2. Should NeedAssistance pause overdue calculation?
3. Should NeedAssistance require CareCoordinator acknowledgement?

---

# 17. Current MVP Scope

For the MVP, this bounded context should focus only on:

- creating CareTasks
- adding CareTasks to Today’s CareTaskList
- assigning CareTasks to Caregivers
- showing assigned CareTasks in My Tasks
- marking CareTasks as Completed
- marking CareTasks as UnableToComplete
- marking CareTasks as NeedAssistance
- marking CareTasks as Overdue
- marking CareTasks as Missed
- cancelling CareTasks
- reactivating Cancelled CareTasks
- showing CareTask progress in the CareCoordinatorDashboard

Out of scope for the first MVP:

- advanced incident handling
- physical reporting devices
- full recurring routine engine
- family communication
- AI risk prediction
- EHR integration
- medication administration management

---

# Maintenance Note

This file should be treated as a living document. Every time a better term is discovered from a caregiver, nurse, manager, or domain expert, update this `UL.md` file before changing code names, events, commands, or documentation.

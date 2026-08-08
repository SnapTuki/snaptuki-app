# 6. CareTask Status Definitions

---

## Planned

The CareTask is part of Today’s CareTaskList but has not yet been assigned to a Caregiver.

---

## Assigned

A planned / new care task CareTask has been assigned to a Caregiver.

---

## Completed

The CareTask has been completed by a Caregiver.

### Rule

Completion must record:

- who completed the CareTask
- when it was completed
- optional completion note

### Important distinction

If a CareTask is completed after its DueTime, it can still have the status `Completed`. The system can calculate that it was completed late by comparing `completedAt` with `dueTime`.
---

## UnableToComplete

The Caregiver could not complete the CareTask.

This status should be used when the CareTask cannot be completed because of a clear reason.

### Example reasons

- Resident refused.
- Resident was sleeping.
- Equipment was missing.
- Caregiver needed nurse support.
- Caregiver could not access the room.
- Not enough time.
- Other.

### Rule

UnableToComplete should require a reason.

---

## NeedAssistance

The Caregiver needs help to complete the CareTask.

This does not necessarily mean the CareTask has failed. It means the Caregiver cannot safely or properly continue alone.

### Example reasons

- Need another Caregiver.
- Need nurse support.
- Resident is aggressive or distressed.
- Equipment is needed.
- Care task requires two people.
- Unclear instruction.

### Rule

NeedAssistance should be visible immediately to the CareCoordinator.

---

## Overdue

The CareTask has passed its DueTime and has not been completed, cancelled, or marked as missed.

Overdue means the task is late but may still be completed or handled during the current shift.

### Rule

The system marks a CareTask as Overdue when:

```text
current time > DueTime
AND status is not Completed
AND status is not Cancelled
AND status is not Missed
```

### Overdue duration

The dashboard should show how long the CareTask has been overdue.

---

## Missed

The CareTask was not completed before the assigned Caregiver’s working shift ended.

### Meaning

Missed is stronger than Overdue. It means the task was not completed during the responsible working shift.

### Rule

The system marks a CareTask as Missed when:

```text
CareTask is incomplete
AND assigned Caregiver’s shift has ended
AND CareTask is not Completed
AND CareTask is not Cancelled
```

### Business meaning

Missed CareTasks should be reviewed by a CareCoordinator.

---

## Cancelled

The CareTask was cancelled by the Creator or an authorized CareCoordinator.

### Rule

Cancellation requires a reason.

### Example cancellation reasons

- Task no longer needed.
- Resident unavailable.
- Duplicate CareTask.
- Created by mistake.
- Replaced by another CareTask.
- Care plan changed.

---

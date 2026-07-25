# CareTask Business Rules

## Creation Rules

1. A CareCoordinator can create a CareTask.
2. A CareTask must have a title.
3. A CareTask must have a due time.
4. A CareTask must have a priority.
5. A CareTask must be linked to a Resident and lcoation (room).
6. A CareTask might have a list of instruction lines.
7. A CareTask must be created in advanced.

## Due time rules

1. Due date can only be set for today or tomorrow.
2. Due time cannot be in past.


## Today's CareTaskList Rules

1. A CareCoordinator can add a CareTask to Today's CareTaskList.
2. A CareTask in Today's CareTaskList can be assigned to a Caregiver.
3. A CareTask can be selected by a caregiver
4. Today's CareTaskList should be priotrized by status and duetime.

## Assignment Rules

1. A CareTask can be assigned to one Caregiver.
2. A CareTask can be reassigned by a CareCoordinator if it is not Completed, Missed, or Cancelled.
3. A Caregiver can only update CareTasks assigned to them, unless special permission is granted.

## Completion Rules

1. A Caregiver can mark an assigned CareTask as Completed.
2. Completion records the Caregiver, completion time, Optional completion note.
3. If a CareTask is completed after its due time, it is still Completed, but it is considered completed late.

## Unable To Complete Rules

1. A Caregiver can mark a CareTask as UnableToComplete.
2. UnableToComplete requires a reason.
3. A CareCoordinator must review UnableToComplete CareTasks.
4. UnableToComplete CareTask can be reassigned or rescheduled by CareCoordinator.

## Assistance Rules

18. A Caregiver can mark a CareTask as NeedAssistance.
19. NeedAssistance CareTasks are highlighted on the CareCoordinator dashboard.
20. A CareCoordinator can reassign or follow up on NeedAssistance CareTasks.

## Overdue Rules

21. A CareTask becomes Overdue when its due time passes and it is not Completed, Cancelled, or Missed.
22. The dashboard shows overdue duration in minutes or hours.

## Missed Rules

23. A CareTask becomes Missed if it remains incomplete when the assigned Caregiver’s shift ends.
24. Missed CareTasks must be visible to the CareCoordinator.
25. A Missed CareTask should require review or follow-up.

## Cancellation Rules

26. A CareTask can be cancelled only by the creator or an authorized CareCoordinator.
27. Cancelling a CareTask requires a reason.
28. A Cancelled CareTask cannot be completed.

## Late Change Rules

29. CareTask details can be updated before the due time.
30. If CareTask details are updated less than 15 minutes before due time, a reason is required.
31. All CareTask detail changes are recorded in the audit trail.

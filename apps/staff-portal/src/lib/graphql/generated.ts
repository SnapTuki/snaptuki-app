import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type ActionRecordType = {
  __typename?: 'ActionRecordType';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['JSON']['output']>;
};

export type ActivateUserInput = {
  userId: Scalars['ID']['input'];
};

export type AddCaregiverCertificationInputGql = {
  caregiverId: Scalars['ID']['input'];
  certId: Scalars['ID']['input'];
  issuer: Scalars['String']['input'];
  name: Scalars['String']['input'];
  validFrom: Scalars['DateTime']['input'];
  validTo?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AddResidentAllergyInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  reaction: Scalars['String']['input'];
  residentId: Scalars['ID']['input'];
  severity: AllergySeverity;
};

export type AddResidentMedicationInput = {
  dosage: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  frequency: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  prescribedBy?: InputMaybe<Scalars['String']['input']>;
  residentId: Scalars['ID']['input'];
  startDate: Scalars['DateTime']['input'];
};

export enum AllergySeverity {
  Mild = 'MILD',
  Moderate = 'MODERATE',
  Severe = 'SEVERE'
}

export type AllergyType = {
  __typename?: 'AllergyType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  reaction: Scalars['String']['output'];
  severity: AllergySeverity;
};

export type AssignPrimaryCaregiverInput = {
  caregiverId: Scalars['ID']['input'];
  residentId: Scalars['ID']['input'];
};

export type AssignRoleInput = {
  role: Role;
  userId: Scalars['ID']['input'];
};

export type AuthResultGql = {
  __typename?: 'AuthResultGQL';
  token: Scalars['String']['output'];
  user: User;
};

export type AuthenticateInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum CaregiverRole {
  Caregiver = 'CAREGIVER',
  Coordinator = 'COORDINATOR',
  HeadNurse = 'HEAD_NURSE'
}

export enum CaregiverStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Suspended = 'SUSPENDED'
}

export type CaregiverType = {
  __typename?: 'CaregiverType';
  certifications: Array<CertificationType>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  employmentType: EmploymentType;
  firstName: Scalars['String']['output'];
  hireDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  role: CaregiverRole;
  status: CaregiverStatus;
  updatedAt: Scalars['DateTime']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type CertificationType = {
  __typename?: 'CertificationType';
  id: Scalars['ID']['output'];
  issuer: Scalars['String']['output'];
  name: Scalars['String']['output'];
  validFrom: Scalars['DateTime']['output'];
  validTo?: Maybe<Scalars['DateTime']['output']>;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type ChecklistItemInput = {
  done?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  label: Scalars['String']['input'];
  required?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CompleteTaskInputGql = {
  completedByCaregiverId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTaskInput = {
  assignedCaregiverId: Scalars['String']['input'];
  category: TaskCategory;
  checklist?: InputMaybe<Array<ChecklistItemInput>>;
  description: Scalars['String']['input'];
  dueAt?: InputMaybe<Scalars['DateTime']['input']>;
  priority: TaskPriority;
  residentId?: InputMaybe<Scalars['String']['input']>;
  status: TaskStatus;
  title: Scalars['String']['input'];
};

export type EmergencyContactInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  isPrimary?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  relation: Scalars['String']['input'];
};

export type EmergencyContactType = {
  __typename?: 'EmergencyContactType';
  id: Scalars['ID']['output'];
  isPrimary: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  relation: Scalars['String']['output'];
};

export enum EmploymentType {
  Contract = 'CONTRACT',
  FullTime = 'FULL_TIME',
  PartTime = 'PART_TIME'
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER',
  Unspecified = 'UNSPECIFIED'
}

export type MedicationType = {
  __typename?: 'MedicationType';
  dosage: Scalars['String']['output'];
  endDate?: Maybe<Scalars['DateTime']['output']>;
  frequency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  prescribedBy?: Maybe<Scalars['String']['output']>;
  startDate: Scalars['DateTime']['output'];
};

export enum MobilityLevel {
  Assisted = 'Assisted',
  Independent = 'Independent',
  Memory = 'Memory'
}

export type Mutation = {
  __typename?: 'Mutation';
  activateUser: Scalars['Boolean']['output'];
  addCaregiverCertification: CaregiverType;
  addResidentAllergy: ResidentType;
  addResidentMedication: ResidentType;
  assignPrimaryCaregiver: ResidentType;
  assignRole: User;
  authenticateUser: AuthResultGql;
  changePassword: Scalars['Boolean']['output'];
  completeTask: Task;
  createTask: Task;
  deactivateCaregiver: CaregiverType;
  dischargeResident: ResidentType;
  registerCaregiver: CaregiverType;
  registerResident: ResidentType;
  registerUser: User;
  toggleChecklistItem: Task;
  updateCaregiverContact: CaregiverType;
  updateEmergencyContacts: ResidentType;
  updateResidentIdentity: ResidentType;
  updateTask: Task;
};


export type MutationActivateUserArgs = {
  input: ActivateUserInput;
};


export type MutationAddCaregiverCertificationArgs = {
  input: AddCaregiverCertificationInputGql;
};


export type MutationAddResidentAllergyArgs = {
  input: AddResidentAllergyInput;
};


export type MutationAddResidentMedicationArgs = {
  input: AddResidentMedicationInput;
};


export type MutationAssignPrimaryCaregiverArgs = {
  input: AssignPrimaryCaregiverInput;
};


export type MutationAssignRoleArgs = {
  input: AssignRoleInput;
};


export type MutationAuthenticateUserArgs = {
  input: AuthenticateInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCompleteTaskArgs = {
  input: CompleteTaskInputGql;
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationDeactivateCaregiverArgs = {
  id: Scalars['String']['input'];
};


export type MutationDischargeResidentArgs = {
  id: Scalars['String']['input'];
};


export type MutationRegisterCaregiverArgs = {
  input: RegisterCaregiverInputGql;
};


export type MutationRegisterResidentArgs = {
  input: RegisterResidentInput;
};


export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};


export type MutationToggleChecklistItemArgs = {
  input: ToggleChecklistItemInputGql;
};


export type MutationUpdateCaregiverContactArgs = {
  input: UpdateCaregiverContactInputGql;
};


export type MutationUpdateEmergencyContactsArgs = {
  contacts: Array<EmergencyContactInput>;
  residentId: Scalars['String']['input'];
};


export type MutationUpdateResidentIdentityArgs = {
  input: UpdateResidentIdentityInput;
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};

export type Query = {
  __typename?: 'Query';
  caregiverById?: Maybe<CaregiverType>;
  caregiverList: Array<CaregiverType>;
  getResidentById?: Maybe<ResidentType>;
  me?: Maybe<User>;
  residentList: Array<ResidentType>;
  taskById?: Maybe<Task>;
  taskList: Array<Task>;
};


export type QueryCaregiverByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryCaregiverListArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetResidentByIdArgs = {
  residentId: Scalars['String']['input'];
};


export type QueryResidentListArgs = {
  mobilityLevel?: InputMaybe<MobilityLevel>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTaskByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryTaskListArgs = {
  caregiverId?: InputMaybe<Scalars['String']['input']>;
  residentId?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
};

export type RegisterCaregiverInputGql = {
  agencyId?: InputMaybe<Scalars['Float']['input']>;
  email: Scalars['String']['input'];
  employmentType: EmploymentType;
  firstName: Scalars['String']['input'];
  hireDate: Scalars['DateTime']['input'];
  lastName: Scalars['String']['input'];
  passwordHash: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  role: CaregiverRole;
};

export type RegisterResidentInput = {
  agencyId: Scalars['Float']['input'];
  birthDate: Scalars['DateTime']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  gender: Gender;
  lastName: Scalars['String']['input'];
  mobilityLevel: MobilityLevel;
  mrn: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  room?: InputMaybe<Scalars['String']['input']>;
};

export type RegisterUserInput = {
  agencyId?: InputMaybe<Scalars['Float']['input']>;
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  roles?: InputMaybe<Array<Role>>;
};

export type ResidentChecklistItem = {
  __typename?: 'ResidentChecklistItem';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  isRequired: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
};

export enum ResidentStatus {
  Active = 'Active',
  Discharged = 'Discharged'
}

export type ResidentTask = {
  __typename?: 'ResidentTask';
  actionRecords: Array<ActionRecordType>;
  category: TaskCategory;
  checklist: Array<ResidentChecklistItem>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  completionNotes?: Maybe<Scalars['String']['output']>;
  dueAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  priority: TaskPriority;
  status: TaskStatus;
};

export type ResidentType = {
  __typename?: 'ResidentType';
  allergies: Array<AllergyType>;
  birthDate: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  emergencyContacts: Array<EmergencyContactType>;
  firstName: Scalars['String']['output'];
  gender: Gender;
  lastName: Scalars['String']['output'];
  medications: Array<MedicationType>;
  mobilityLevel: MobilityLevel;
  mrn: Scalars['String']['output'];
  residentId: Scalars['ID']['output'];
  room?: Maybe<Scalars['String']['output']>;
  status: ResidentStatus;
  taskAssignments: Array<TaskAssignmentType>;
  tasks: Array<ResidentTask>;
};

export enum Role {
  AgencyStaff = 'AGENCY_STAFF',
  Caregiver = 'CAREGIVER',
  Supervisor = 'SUPERVISOR',
  SuperAdmin = 'SUPER_ADMIN'
}

export type Task = {
  __typename?: 'Task';
  assignedCaregiver?: Maybe<TaskTypeCaregiverProfile>;
  assignedCaregiverId?: Maybe<Scalars['String']['output']>;
  category: TaskCategory;
  checklist: Array<TaskChecklistItem>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  completionNotes?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdByUserId?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dueAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  priority: TaskPriority;
  resident?: Maybe<ResidentType>;
  residentId: Scalars['String']['output'];
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  status: TaskStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  visit?: Maybe<Visit>;
};

export type TaskAssignmentType = {
  __typename?: 'TaskAssignmentType';
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  taskTemplate: TaskTemplateType;
};

export enum TaskCategory {
  Admin = 'ADMIN',
  Care = 'CARE',
  Hygiene = 'HYGIENE',
  Medication = 'MEDICATION',
  Other = 'OTHER'
}

export type TaskChecklistItem = {
  __typename?: 'TaskChecklistItem';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  isRequired: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
};

export enum TaskPriority {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export enum TaskStatus {
  Assigned = 'ASSIGNED',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export type TaskTemplateType = {
  __typename?: 'TaskTemplateType';
  category: TaskCategory;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  priority: TaskPriority;
};

export type TaskTypeCaregiverProfile = {
  __typename?: 'TaskTypeCaregiverProfile';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
};

export type ToggleChecklistItemInputGql = {
  byCaregiverId?: InputMaybe<Scalars['String']['input']>;
  done: Scalars['Boolean']['input'];
  itemId: Scalars['ID']['input'];
  taskId: Scalars['ID']['input'];
};

export type UpdateCaregiverContactInputGql = {
  email: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateResidentIdentityInput = {
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Gender>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  residentId: Scalars['ID']['input'];
  ssn?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTaskInput = {
  assignedCaregiverId?: InputMaybe<Scalars['String']['input']>;
  checklist?: InputMaybe<Array<ChecklistItemInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueAt?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['String']['input'];
  priority?: InputMaybe<TaskPriority>;
  status?: InputMaybe<TaskStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  active: Scalars['Boolean']['output'];
  agencyId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  roles: Array<Role>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type Visit = {
  __typename?: 'Visit';
  actualEnd?: Maybe<Scalars['DateTime']['output']>;
  actualStart?: Maybe<Scalars['DateTime']['output']>;
  caregiver: CaregiverType;
  createdAt: Scalars['DateTime']['output'];
  resident: ResidentType;
  scheduledEnd: Scalars['DateTime']['output'];
  scheduledStart: Scalars['DateTime']['output'];
  status: VisitStatus;
  tasks: Array<Task>;
  updatedAt: Scalars['DateTime']['output'];
  visitId: Scalars['ID']['output'];
};

export enum VisitStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Planned = 'PLANNED'
}

export type AuthenticateUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type AuthenticateUserMutation = { __typename?: 'Mutation', authenticateUser: { __typename?: 'AuthResultGQL', token: string, user: { __typename?: 'User', userId: string, email: string, firstName?: string | null, lastName?: string | null } } };

export type RegisterCaregiverMutationVariables = Exact<{
  input: RegisterCaregiverInputGql;
}>;


export type RegisterCaregiverMutation = { __typename?: 'Mutation', registerCaregiver: { __typename?: 'CaregiverType', id: string } };

export type CaregiverListQueryVariables = Exact<{ [key: string]: never; }>;


export type CaregiverListQuery = { __typename?: 'Query', caregiverList: Array<{ __typename?: 'CaregiverType', id: string, firstName: string, lastName: string, email: string, phone?: string | null, role: CaregiverRole, status: CaregiverStatus }> };

export type RegisterResidentMutationVariables = Exact<{
  input: RegisterResidentInput;
}>;


export type RegisterResidentMutation = { __typename?: 'Mutation', registerResident: { __typename?: 'ResidentType', mrn: string } };

export type UpdateResidentIdentityMutationVariables = Exact<{
  input: UpdateResidentIdentityInput;
}>;


export type UpdateResidentIdentityMutation = { __typename?: 'Mutation', updateResidentIdentity: { __typename?: 'ResidentType', residentId: string, firstName: string, lastName: string, gender: Gender, birthDate: any } };

export type UpdateEmergencyContactsMutationVariables = Exact<{
  residentId: Scalars['String']['input'];
  contacts: Array<EmergencyContactInput> | EmergencyContactInput;
}>;


export type UpdateEmergencyContactsMutation = { __typename?: 'Mutation', updateEmergencyContacts: { __typename?: 'ResidentType', residentId: string, emergencyContacts: Array<{ __typename?: 'EmergencyContactType', name: string, relation: string, phone: string }> } };

export type ResidentListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type ResidentListQuery = { __typename?: 'Query', residentList: Array<{ __typename?: 'ResidentType', residentId: string, mrn: string, firstName: string, lastName: string, birthDate: any, gender: Gender, mobilityLevel: MobilityLevel, status: ResidentStatus, room?: string | null, emergencyContacts: Array<{ __typename?: 'EmergencyContactType', id: string, name: string, relation: string, phone: string }> }> };

export type GetResidentByIdQueryVariables = Exact<{
  residentId: Scalars['String']['input'];
}>;


export type GetResidentByIdQuery = { __typename?: 'Query', getResidentById?: { __typename?: 'ResidentType', residentId: string, mrn: string, firstName: string, lastName: string, birthDate: any, gender: Gender, status: ResidentStatus, room?: string | null, mobilityLevel: MobilityLevel, createdAt: any, allergies: Array<{ __typename?: 'AllergyType', id: string, name: string, reaction: string, severity: AllergySeverity }>, medications: Array<{ __typename?: 'MedicationType', id: string, name: string, dosage: string, frequency: string, startDate: any, endDate?: any | null }>, emergencyContacts: Array<{ __typename?: 'EmergencyContactType', id: string, name: string, relation: string, phone: string, isPrimary: boolean }>, taskAssignments: Array<{ __typename?: 'TaskAssignmentType', id: number, isActive: boolean, taskTemplate: { __typename?: 'TaskTemplateType', id: number, name: string, category: TaskCategory, priority: TaskPriority } }>, tasks: Array<{ __typename?: 'ResidentTask', id: string, status: TaskStatus, priority: TaskPriority, category: TaskCategory, dueAt: any, completedAt?: any | null, completionNotes?: string | null, checklist: Array<{ __typename?: 'ResidentChecklistItem', id: string, label: string, isCompleted: boolean, completedAt?: any | null }>, actionRecords: Array<{ __typename?: 'ActionRecordType', id: number, value?: any | null, notes?: string | null, createdAt: any }> }> } | null };

export type CreateAdHocTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;


export type CreateAdHocTaskMutation = { __typename?: 'Mutation', createTask: { __typename?: 'Task', id: string, status: TaskStatus, priority: TaskPriority } };

export type UpdateTaskMutationVariables = Exact<{
  input: UpdateTaskInput;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask: { __typename?: 'Task', id: string } };

export type GetTaskListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  residentId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTaskListQuery = { __typename?: 'Query', taskList: Array<{ __typename?: 'Task', id: string, title: string, category: TaskCategory, priority: TaskPriority, description?: string | null, status: TaskStatus, dueAt?: any | null, resident?: { __typename?: 'ResidentType', firstName: string, lastName: string } | null, assignedCaregiver?: { __typename?: 'TaskTypeCaregiverProfile', firstName: string, lastName: string } | null, checklist: Array<{ __typename?: 'TaskChecklistItem', id: string, label: string }> }> };

export type SearchResidentsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchResidentsQuery = { __typename?: 'Query', residentList: Array<{ __typename?: 'ResidentType', residentId: string, firstName: string, lastName: string }> };

export type SearchCaregiversQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchCaregiversQuery = { __typename?: 'Query', caregiverList: Array<{ __typename?: 'CaregiverType', id: string, firstName: string, lastName: string }> };


export const AuthenticateUserDocument = gql`
    mutation AuthenticateUser($email: String!, $password: String!) {
  authenticateUser(input: {email: $email, password: $password}) {
    token
    user {
      userId
      email
      firstName
      lastName
    }
  }
}
    `;
export type AuthenticateUserMutationFn = Apollo.MutationFunction<AuthenticateUserMutation, AuthenticateUserMutationVariables>;

/**
 * __useAuthenticateUserMutation__
 *
 * To run a mutation, you first call `useAuthenticateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthenticateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authenticateUserMutation, { data, loading, error }] = useAuthenticateUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useAuthenticateUserMutation(baseOptions?: Apollo.MutationHookOptions<AuthenticateUserMutation, AuthenticateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AuthenticateUserMutation, AuthenticateUserMutationVariables>(AuthenticateUserDocument, options);
      }
export type AuthenticateUserMutationHookResult = ReturnType<typeof useAuthenticateUserMutation>;
export type AuthenticateUserMutationResult = Apollo.MutationResult<AuthenticateUserMutation>;
export type AuthenticateUserMutationOptions = Apollo.BaseMutationOptions<AuthenticateUserMutation, AuthenticateUserMutationVariables>;
export const RegisterCaregiverDocument = gql`
    mutation RegisterCaregiver($input: RegisterCaregiverInputGql!) {
  registerCaregiver(input: $input) {
    id
  }
}
    `;
export type RegisterCaregiverMutationFn = Apollo.MutationFunction<RegisterCaregiverMutation, RegisterCaregiverMutationVariables>;

/**
 * __useRegisterCaregiverMutation__
 *
 * To run a mutation, you first call `useRegisterCaregiverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterCaregiverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerCaregiverMutation, { data, loading, error }] = useRegisterCaregiverMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterCaregiverMutation(baseOptions?: Apollo.MutationHookOptions<RegisterCaregiverMutation, RegisterCaregiverMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterCaregiverMutation, RegisterCaregiverMutationVariables>(RegisterCaregiverDocument, options);
      }
export type RegisterCaregiverMutationHookResult = ReturnType<typeof useRegisterCaregiverMutation>;
export type RegisterCaregiverMutationResult = Apollo.MutationResult<RegisterCaregiverMutation>;
export type RegisterCaregiverMutationOptions = Apollo.BaseMutationOptions<RegisterCaregiverMutation, RegisterCaregiverMutationVariables>;
export const CaregiverListDocument = gql`
    query CaregiverList {
  caregiverList {
    id
    firstName
    lastName
    email
    phone
    role
    status
  }
}
    `;

/**
 * __useCaregiverListQuery__
 *
 * To run a query within a React component, call `useCaregiverListQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaregiverListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaregiverListQuery({
 *   variables: {
 *   },
 * });
 */
export function useCaregiverListQuery(baseOptions?: Apollo.QueryHookOptions<CaregiverListQuery, CaregiverListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CaregiverListQuery, CaregiverListQueryVariables>(CaregiverListDocument, options);
      }
export function useCaregiverListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CaregiverListQuery, CaregiverListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CaregiverListQuery, CaregiverListQueryVariables>(CaregiverListDocument, options);
        }
// @ts-ignore
export function useCaregiverListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CaregiverListQuery, CaregiverListQueryVariables>): Apollo.UseSuspenseQueryResult<CaregiverListQuery, CaregiverListQueryVariables>;
export function useCaregiverListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CaregiverListQuery, CaregiverListQueryVariables>): Apollo.UseSuspenseQueryResult<CaregiverListQuery | undefined, CaregiverListQueryVariables>;
export function useCaregiverListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CaregiverListQuery, CaregiverListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CaregiverListQuery, CaregiverListQueryVariables>(CaregiverListDocument, options);
        }
export type CaregiverListQueryHookResult = ReturnType<typeof useCaregiverListQuery>;
export type CaregiverListLazyQueryHookResult = ReturnType<typeof useCaregiverListLazyQuery>;
export type CaregiverListSuspenseQueryHookResult = ReturnType<typeof useCaregiverListSuspenseQuery>;
export type CaregiverListQueryResult = Apollo.QueryResult<CaregiverListQuery, CaregiverListQueryVariables>;
export const RegisterResidentDocument = gql`
    mutation RegisterResident($input: RegisterResidentInput!) {
  registerResident(input: $input) {
    mrn
  }
}
    `;
export type RegisterResidentMutationFn = Apollo.MutationFunction<RegisterResidentMutation, RegisterResidentMutationVariables>;

/**
 * __useRegisterResidentMutation__
 *
 * To run a mutation, you first call `useRegisterResidentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterResidentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerResidentMutation, { data, loading, error }] = useRegisterResidentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterResidentMutation(baseOptions?: Apollo.MutationHookOptions<RegisterResidentMutation, RegisterResidentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterResidentMutation, RegisterResidentMutationVariables>(RegisterResidentDocument, options);
      }
export type RegisterResidentMutationHookResult = ReturnType<typeof useRegisterResidentMutation>;
export type RegisterResidentMutationResult = Apollo.MutationResult<RegisterResidentMutation>;
export type RegisterResidentMutationOptions = Apollo.BaseMutationOptions<RegisterResidentMutation, RegisterResidentMutationVariables>;
export const UpdateResidentIdentityDocument = gql`
    mutation UpdateResidentIdentity($input: UpdateResidentIdentityInput!) {
  updateResidentIdentity(input: $input) {
    residentId
    firstName
    lastName
    gender
    birthDate
  }
}
    `;
export type UpdateResidentIdentityMutationFn = Apollo.MutationFunction<UpdateResidentIdentityMutation, UpdateResidentIdentityMutationVariables>;

/**
 * __useUpdateResidentIdentityMutation__
 *
 * To run a mutation, you first call `useUpdateResidentIdentityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateResidentIdentityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateResidentIdentityMutation, { data, loading, error }] = useUpdateResidentIdentityMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateResidentIdentityMutation(baseOptions?: Apollo.MutationHookOptions<UpdateResidentIdentityMutation, UpdateResidentIdentityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateResidentIdentityMutation, UpdateResidentIdentityMutationVariables>(UpdateResidentIdentityDocument, options);
      }
export type UpdateResidentIdentityMutationHookResult = ReturnType<typeof useUpdateResidentIdentityMutation>;
export type UpdateResidentIdentityMutationResult = Apollo.MutationResult<UpdateResidentIdentityMutation>;
export type UpdateResidentIdentityMutationOptions = Apollo.BaseMutationOptions<UpdateResidentIdentityMutation, UpdateResidentIdentityMutationVariables>;
export const UpdateEmergencyContactsDocument = gql`
    mutation UpdateEmergencyContacts($residentId: String!, $contacts: [EmergencyContactInput!]!) {
  updateEmergencyContacts(residentId: $residentId, contacts: $contacts) {
    residentId
    emergencyContacts {
      name
      relation
      phone
    }
  }
}
    `;
export type UpdateEmergencyContactsMutationFn = Apollo.MutationFunction<UpdateEmergencyContactsMutation, UpdateEmergencyContactsMutationVariables>;

/**
 * __useUpdateEmergencyContactsMutation__
 *
 * To run a mutation, you first call `useUpdateEmergencyContactsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEmergencyContactsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEmergencyContactsMutation, { data, loading, error }] = useUpdateEmergencyContactsMutation({
 *   variables: {
 *      residentId: // value for 'residentId'
 *      contacts: // value for 'contacts'
 *   },
 * });
 */
export function useUpdateEmergencyContactsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEmergencyContactsMutation, UpdateEmergencyContactsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEmergencyContactsMutation, UpdateEmergencyContactsMutationVariables>(UpdateEmergencyContactsDocument, options);
      }
export type UpdateEmergencyContactsMutationHookResult = ReturnType<typeof useUpdateEmergencyContactsMutation>;
export type UpdateEmergencyContactsMutationResult = Apollo.MutationResult<UpdateEmergencyContactsMutation>;
export type UpdateEmergencyContactsMutationOptions = Apollo.BaseMutationOptions<UpdateEmergencyContactsMutation, UpdateEmergencyContactsMutationVariables>;
export const ResidentListDocument = gql`
    query ResidentList($search: String) {
  residentList(search: $search) {
    residentId
    mrn
    firstName
    lastName
    birthDate
    gender
    mobilityLevel
    status
    room
    emergencyContacts {
      id
      name
      relation
      phone
    }
  }
}
    `;

/**
 * __useResidentListQuery__
 *
 * To run a query within a React component, call `useResidentListQuery` and pass it any options that fit your needs.
 * When your component renders, `useResidentListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResidentListQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useResidentListQuery(baseOptions?: Apollo.QueryHookOptions<ResidentListQuery, ResidentListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResidentListQuery, ResidentListQueryVariables>(ResidentListDocument, options);
      }
export function useResidentListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResidentListQuery, ResidentListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResidentListQuery, ResidentListQueryVariables>(ResidentListDocument, options);
        }
// @ts-ignore
export function useResidentListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ResidentListQuery, ResidentListQueryVariables>): Apollo.UseSuspenseQueryResult<ResidentListQuery, ResidentListQueryVariables>;
export function useResidentListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ResidentListQuery, ResidentListQueryVariables>): Apollo.UseSuspenseQueryResult<ResidentListQuery | undefined, ResidentListQueryVariables>;
export function useResidentListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ResidentListQuery, ResidentListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ResidentListQuery, ResidentListQueryVariables>(ResidentListDocument, options);
        }
export type ResidentListQueryHookResult = ReturnType<typeof useResidentListQuery>;
export type ResidentListLazyQueryHookResult = ReturnType<typeof useResidentListLazyQuery>;
export type ResidentListSuspenseQueryHookResult = ReturnType<typeof useResidentListSuspenseQuery>;
export type ResidentListQueryResult = Apollo.QueryResult<ResidentListQuery, ResidentListQueryVariables>;
export const GetResidentByIdDocument = gql`
    query GetResidentById($residentId: String!) {
  getResidentById(residentId: $residentId) {
    residentId
    mrn
    firstName
    lastName
    birthDate
    gender
    status
    room
    mobilityLevel
    createdAt
    allergies {
      id
      name
      reaction
      severity
    }
    medications {
      id
      name
      dosage
      frequency
      startDate
      endDate
    }
    emergencyContacts {
      id
      name
      relation
      phone
      isPrimary
    }
    taskAssignments {
      id
      isActive
      taskTemplate {
        id
        name
        category
        priority
      }
    }
    tasks {
      id
      status
      priority
      category
      dueAt
      completedAt
      completionNotes
      checklist {
        id
        label
        isCompleted
        completedAt
      }
      actionRecords {
        id
        value
        notes
        createdAt
      }
    }
  }
}
    `;

/**
 * __useGetResidentByIdQuery__
 *
 * To run a query within a React component, call `useGetResidentByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetResidentByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetResidentByIdQuery({
 *   variables: {
 *      residentId: // value for 'residentId'
 *   },
 * });
 */
export function useGetResidentByIdQuery(baseOptions: Apollo.QueryHookOptions<GetResidentByIdQuery, GetResidentByIdQueryVariables> & ({ variables: GetResidentByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetResidentByIdQuery, GetResidentByIdQueryVariables>(GetResidentByIdDocument, options);
      }
export function useGetResidentByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetResidentByIdQuery, GetResidentByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetResidentByIdQuery, GetResidentByIdQueryVariables>(GetResidentByIdDocument, options);
        }
// @ts-ignore
export function useGetResidentByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetResidentByIdQuery, GetResidentByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetResidentByIdQuery, GetResidentByIdQueryVariables>;
export function useGetResidentByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetResidentByIdQuery, GetResidentByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetResidentByIdQuery | undefined, GetResidentByIdQueryVariables>;
export function useGetResidentByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetResidentByIdQuery, GetResidentByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetResidentByIdQuery, GetResidentByIdQueryVariables>(GetResidentByIdDocument, options);
        }
export type GetResidentByIdQueryHookResult = ReturnType<typeof useGetResidentByIdQuery>;
export type GetResidentByIdLazyQueryHookResult = ReturnType<typeof useGetResidentByIdLazyQuery>;
export type GetResidentByIdSuspenseQueryHookResult = ReturnType<typeof useGetResidentByIdSuspenseQuery>;
export type GetResidentByIdQueryResult = Apollo.QueryResult<GetResidentByIdQuery, GetResidentByIdQueryVariables>;
export const CreateAdHocTaskDocument = gql`
    mutation CreateAdHocTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    status
    priority
  }
}
    `;
export type CreateAdHocTaskMutationFn = Apollo.MutationFunction<CreateAdHocTaskMutation, CreateAdHocTaskMutationVariables>;

/**
 * __useCreateAdHocTaskMutation__
 *
 * To run a mutation, you first call `useCreateAdHocTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdHocTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdHocTaskMutation, { data, loading, error }] = useCreateAdHocTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAdHocTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdHocTaskMutation, CreateAdHocTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdHocTaskMutation, CreateAdHocTaskMutationVariables>(CreateAdHocTaskDocument, options);
      }
export type CreateAdHocTaskMutationHookResult = ReturnType<typeof useCreateAdHocTaskMutation>;
export type CreateAdHocTaskMutationResult = Apollo.MutationResult<CreateAdHocTaskMutation>;
export type CreateAdHocTaskMutationOptions = Apollo.BaseMutationOptions<CreateAdHocTaskMutation, CreateAdHocTaskMutationVariables>;
export const UpdateTaskDocument = gql`
    mutation UpdateTask($input: UpdateTaskInput!) {
  updateTask(input: $input) {
    id
  }
}
    `;
export type UpdateTaskMutationFn = Apollo.MutationFunction<UpdateTaskMutation, UpdateTaskMutationVariables>;

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskMutation, { data, loading, error }] = useUpdateTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTaskMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskMutation, UpdateTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, options);
      }
export type UpdateTaskMutationHookResult = ReturnType<typeof useUpdateTaskMutation>;
export type UpdateTaskMutationResult = Apollo.MutationResult<UpdateTaskMutation>;
export type UpdateTaskMutationOptions = Apollo.BaseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const GetTaskListDocument = gql`
    query GetTaskList($search: String, $status: String, $residentId: String) {
  taskList(search: $search, status: $status, residentId: $residentId) {
    id
    title
    category
    priority
    description
    status
    dueAt
    resident {
      firstName
      lastName
    }
    assignedCaregiver {
      firstName
      lastName
    }
    checklist {
      id
      label
    }
  }
}
    `;

/**
 * __useGetTaskListQuery__
 *
 * To run a query within a React component, call `useGetTaskListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTaskListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTaskListQuery({
 *   variables: {
 *      search: // value for 'search'
 *      status: // value for 'status'
 *      residentId: // value for 'residentId'
 *   },
 * });
 */
export function useGetTaskListQuery(baseOptions?: Apollo.QueryHookOptions<GetTaskListQuery, GetTaskListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTaskListQuery, GetTaskListQueryVariables>(GetTaskListDocument, options);
      }
export function useGetTaskListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTaskListQuery, GetTaskListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTaskListQuery, GetTaskListQueryVariables>(GetTaskListDocument, options);
        }
// @ts-ignore
export function useGetTaskListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTaskListQuery, GetTaskListQueryVariables>): Apollo.UseSuspenseQueryResult<GetTaskListQuery, GetTaskListQueryVariables>;
export function useGetTaskListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTaskListQuery, GetTaskListQueryVariables>): Apollo.UseSuspenseQueryResult<GetTaskListQuery | undefined, GetTaskListQueryVariables>;
export function useGetTaskListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTaskListQuery, GetTaskListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTaskListQuery, GetTaskListQueryVariables>(GetTaskListDocument, options);
        }
export type GetTaskListQueryHookResult = ReturnType<typeof useGetTaskListQuery>;
export type GetTaskListLazyQueryHookResult = ReturnType<typeof useGetTaskListLazyQuery>;
export type GetTaskListSuspenseQueryHookResult = ReturnType<typeof useGetTaskListSuspenseQuery>;
export type GetTaskListQueryResult = Apollo.QueryResult<GetTaskListQuery, GetTaskListQueryVariables>;
export const SearchResidentsDocument = gql`
    query SearchResidents($search: String) {
  residentList(search: $search) {
    residentId
    firstName
    lastName
  }
}
    `;

/**
 * __useSearchResidentsQuery__
 *
 * To run a query within a React component, call `useSearchResidentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchResidentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchResidentsQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useSearchResidentsQuery(baseOptions?: Apollo.QueryHookOptions<SearchResidentsQuery, SearchResidentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchResidentsQuery, SearchResidentsQueryVariables>(SearchResidentsDocument, options);
      }
export function useSearchResidentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchResidentsQuery, SearchResidentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchResidentsQuery, SearchResidentsQueryVariables>(SearchResidentsDocument, options);
        }
// @ts-ignore
export function useSearchResidentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchResidentsQuery, SearchResidentsQueryVariables>): Apollo.UseSuspenseQueryResult<SearchResidentsQuery, SearchResidentsQueryVariables>;
export function useSearchResidentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchResidentsQuery, SearchResidentsQueryVariables>): Apollo.UseSuspenseQueryResult<SearchResidentsQuery | undefined, SearchResidentsQueryVariables>;
export function useSearchResidentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchResidentsQuery, SearchResidentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchResidentsQuery, SearchResidentsQueryVariables>(SearchResidentsDocument, options);
        }
export type SearchResidentsQueryHookResult = ReturnType<typeof useSearchResidentsQuery>;
export type SearchResidentsLazyQueryHookResult = ReturnType<typeof useSearchResidentsLazyQuery>;
export type SearchResidentsSuspenseQueryHookResult = ReturnType<typeof useSearchResidentsSuspenseQuery>;
export type SearchResidentsQueryResult = Apollo.QueryResult<SearchResidentsQuery, SearchResidentsQueryVariables>;
export const SearchCaregiversDocument = gql`
    query SearchCaregivers($search: String) {
  caregiverList(search: $search) {
    id
    firstName
    lastName
  }
}
    `;

/**
 * __useSearchCaregiversQuery__
 *
 * To run a query within a React component, call `useSearchCaregiversQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCaregiversQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCaregiversQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useSearchCaregiversQuery(baseOptions?: Apollo.QueryHookOptions<SearchCaregiversQuery, SearchCaregiversQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchCaregiversQuery, SearchCaregiversQueryVariables>(SearchCaregiversDocument, options);
      }
export function useSearchCaregiversLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchCaregiversQuery, SearchCaregiversQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchCaregiversQuery, SearchCaregiversQueryVariables>(SearchCaregiversDocument, options);
        }
// @ts-ignore
export function useSearchCaregiversSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchCaregiversQuery, SearchCaregiversQueryVariables>): Apollo.UseSuspenseQueryResult<SearchCaregiversQuery, SearchCaregiversQueryVariables>;
export function useSearchCaregiversSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchCaregiversQuery, SearchCaregiversQueryVariables>): Apollo.UseSuspenseQueryResult<SearchCaregiversQuery | undefined, SearchCaregiversQueryVariables>;
export function useSearchCaregiversSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchCaregiversQuery, SearchCaregiversQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchCaregiversQuery, SearchCaregiversQueryVariables>(SearchCaregiversDocument, options);
        }
export type SearchCaregiversQueryHookResult = ReturnType<typeof useSearchCaregiversQuery>;
export type SearchCaregiversLazyQueryHookResult = ReturnType<typeof useSearchCaregiversLazyQuery>;
export type SearchCaregiversSuspenseQueryHookResult = ReturnType<typeof useSearchCaregiversSuspenseQuery>;
export type SearchCaregiversQueryResult = Apollo.QueryResult<SearchCaregiversQuery, SearchCaregiversQueryVariables>;
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
};

export type AddResidentAllergyInput = {
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
  name: Scalars['String']['input'];
  prescribedBy?: InputMaybe<Scalars['String']['input']>;
  residentId: Scalars['ID']['input'];
  startDate: Scalars['DateTime']['input'];
};

export enum AllergySeverity {
  Mild = 'MILD',
  Moderate = 'MODERATE',
  Sever = 'SEVER'
}

export type AllergyType = {
  __typename?: 'AllergyType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  reaction: Scalars['String']['output'];
  severity: AllergySeverity;
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
  id?: InputMaybe<Scalars['ID']['input']>;
  label: Scalars['String']['input'];
};

export type CompleteTaskInputGql = {
  completedByCaregiverId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateChecklistItemInput = {
  label: Scalars['String']['input'];
  required?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateTaskInput = {
  assignedCaregiverId: Scalars['String']['input'];
  category: TaskCategory;
  checklist?: InputMaybe<Array<CreateChecklistItemInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueAt: Scalars['DateTime']['input'];
  priority: TaskPriority;
  residentId: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type EmergencyContactInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
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
  addResidentAllergy: ResidentType;
  addResidentMedication: ResidentType;
  authenticateUser: AuthResultGql;
  cancelTask: Task;
  changePassword: Scalars['Boolean']['output'];
  completeTask: Task;
  createTask: Task;
  dischargeResident: ResidentType;
  reactivateTask: Task;
  registerCaregiver: StaffType;
  registerResident: ResidentType;
  registerUser: User;
  toggleChecklistItem: Task;
  updateCaregiverContact: StaffType;
  updateEmergencyContacts: ResidentType;
  updateResidentIdentity: ResidentType;
  updateTask: Task;
};


export type MutationAddResidentAllergyArgs = {
  input: AddResidentAllergyInput;
};


export type MutationAddResidentMedicationArgs = {
  input: AddResidentMedicationInput;
};


export type MutationAuthenticateUserArgs = {
  input: AuthenticateInput;
};


export type MutationCancelTaskArgs = {
  id: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
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


export type MutationDischargeResidentArgs = {
  id: Scalars['String']['input'];
};


export type MutationReactivateTaskArgs = {
  taskId: Scalars['String']['input'];
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
  caregiverById?: Maybe<StaffType>;
  caregiverList: Array<StaffType>;
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
  dueAt?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  residentId?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Float']['input']>;
};

export type RegisterCaregiverInputGql = {
  birthDate: Scalars['String']['input'];
  email: Scalars['String']['input'];
  employmentType: EmploymentType;
  firstName: Scalars['String']['input'];
  hireDate: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  lastName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  role: StaffRole;
};

export type RegisterResidentInput = {
  agencyId: Scalars['Int']['input'];
  birthDate: Scalars['String']['input'];
  emergencyContacts: Array<EmergencyContactInput>;
  firstName: Scalars['String']['input'];
  gender: Gender;
  lastName: Scalars['String']['input'];
  mobilityLevel: MobilityLevel;
  room?: InputMaybe<Scalars['String']['input']>;
  ssn: Scalars['String']['input'];
};

export type RegisterUserInput = {
  agencyId?: InputMaybe<Scalars['Float']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  roles: Array<UserRole>;
};

export enum ResidentStatus {
  Active = 'Active',
  Discharged = 'Discharged'
}

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
  tasks: Array<Task>;
  updatedAt: Scalars['DateTime']['output'];
};


export type ResidentTypeTasksArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export enum StaffRole {
  Coordinator = 'COORDINATOR',
  Doctor = 'DOCTOR',
  HeadNurse = 'HEAD_NURSE',
  Manager = 'MANAGER',
  Nurse = 'NURSE',
  PracticalNurse = 'PRACTICAL_NURSE'
}

export type StaffType = {
  __typename?: 'StaffType';
  certifications: Array<CertificationType>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  employmentType: EmploymentType;
  firstName: Scalars['String']['output'];
  hireDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  role: StaffRole;
  updatedAt: Scalars['DateTime']['output'];
};

export type Task = {
  __typename?: 'Task';
  assignedCaregiver?: Maybe<TaskCaregiverProfile>;
  assignedCaregiverId?: Maybe<Scalars['String']['output']>;
  assignedResident?: Maybe<TaskResidentProfile>;
  category: TaskCategory;
  checklist: Array<TaskChecklistItem>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  completedByCaregiverId?: Maybe<Scalars['String']['output']>;
  completionNotes?: Maybe<Array<Scalars['String']['output']>>;
  createdAt: Scalars['DateTime']['output'];
  createdByUserId: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  priority: TaskPriority;
  residentId?: Maybe<Scalars['String']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  status: TaskStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TaskCaregiverProfile = {
  __typename?: 'TaskCaregiverProfile';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
};

export enum TaskCategory {
  Care = 'CARE',
  Hygiene = 'HYGIENE',
  Medication = 'MEDICATION',
  Other = 'OTHER',
  Vitals = 'VITALS'
}

export type TaskChecklistItem = {
  __typename?: 'TaskChecklistItem';
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
};

export enum TaskPriority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
  Urgent = 'URGENT'
}

export type TaskResidentProfile = {
  __typename?: 'TaskResidentProfile';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
};

export enum TaskStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Missed = 'MISSED',
  Pending = 'PENDING'
}

export type ToggleChecklistItemInputGql = {
  byCaregiverId?: InputMaybe<Scalars['String']['input']>;
  done: Scalars['Boolean']['input'];
  itemId: Scalars['ID']['input'];
  taskId: Scalars['ID']['input'];
};

export type UpdateCaregiverContactInputGql = {
  id: Scalars['ID']['input'];
  phone: Scalars['String']['input'];
};

export type UpdateResidentIdentityInput = {
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Gender>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  residentId: Scalars['ID']['input'];
};

export type UpdateTaskInput = {
  assignedCaregiverId?: InputMaybe<Scalars['String']['input']>;
  checklist?: InputMaybe<Array<ChecklistItemInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueAt?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  priority?: InputMaybe<TaskPriority>;
  status?: InputMaybe<TaskStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  agencyId: Scalars['Float']['output'];
  roles: Array<UserRole>;
  userId: Scalars['ID']['output'];
};

export enum UserRole {
  Coordinator = 'COORDINATOR',
  Doctor = 'DOCTOR',
  HeadNurse = 'HEAD_NURSE',
  Nurse = 'NURSE',
  PracticalNurse = 'PRACTICAL_NURSE',
  SuperAdmin = 'SUPER_ADMIN'
}

export type AuthenticateUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type AuthenticateUserMutation = { __typename?: 'Mutation', authenticateUser: { __typename?: 'AuthResultGQL', token: string, user: { __typename?: 'User', userId: string, agencyId: number } } };

export type RegisterCaregiverMutationVariables = Exact<{
  input: RegisterCaregiverInputGql;
}>;


export type RegisterCaregiverMutation = { __typename?: 'Mutation', registerCaregiver: { __typename?: 'StaffType', id: string } };

export type CaregiverListQueryVariables = Exact<{ [key: string]: never; }>;


export type CaregiverListQuery = { __typename?: 'Query', caregiverList: Array<{ __typename?: 'StaffType', id: string, firstName: string, lastName: string, email: string, phone?: string | null, role: StaffRole }> };

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

export type CompleteTaskMutationVariables = Exact<{
  input: CompleteTaskInputGql;
}>;


export type CompleteTaskMutation = { __typename?: 'Mutation', completeTask: { __typename?: 'Task', id: string, status: TaskStatus } };

export type CancelResidentTaskMutationVariables = Exact<{
  id: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type CancelResidentTaskMutation = { __typename?: 'Mutation', cancelTask: { __typename?: 'Task', id: string, status: TaskStatus } };

export type UpdateTaskMutationVariables = Exact<{
  input: UpdateTaskInput;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask: { __typename?: 'Task', id: string } };

export type CreateAdHocTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;


export type CreateAdHocTaskMutation = { __typename?: 'Mutation', createTask: { __typename?: 'Task', id: string, status: TaskStatus, priority: TaskPriority } };

export type ResidentListQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type ResidentListQuery = { __typename?: 'Query', residentList: Array<{ __typename?: 'ResidentType', residentId: string, mrn: string, firstName: string, lastName: string, birthDate: any, gender: Gender, mobilityLevel: MobilityLevel, status: ResidentStatus, room?: string | null, emergencyContacts: Array<{ __typename?: 'EmergencyContactType', id: string, name: string, relation: string, phone: string }> }> };

export type ResidentSuggestionsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type ResidentSuggestionsQuery = { __typename?: 'Query', residentList: Array<{ __typename?: 'ResidentType', residentId: string, mrn: string, firstName: string, lastName: string }> };

export type GetResidentByIdQueryVariables = Exact<{
  residentId: Scalars['String']['input'];
}>;


export type GetResidentByIdQuery = { __typename?: 'Query', getResidentById?: { __typename?: 'ResidentType', residentId: string, mrn: string, firstName: string, lastName: string } | null };

export type GetTaskListResidentQueryVariables = Exact<{
  residentId?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTaskListResidentQuery = { __typename?: 'Query', taskList: Array<{ __typename?: 'Task', id: string, title: string, description?: string | null, status: TaskStatus, priority: TaskPriority, dueAt?: any | null, assignedCaregiver?: { __typename?: 'TaskCaregiverProfile', firstName: string, lastName: string } | null, checklist: Array<{ __typename?: 'TaskChecklistItem', id: string, label: string }> }> };

export type SearchCaregiversQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchCaregiversQuery = { __typename?: 'Query', caregiverList: Array<{ __typename?: 'StaffType', id: string, firstName: string, lastName: string }> };

export type GetResidentIdentityProfileQueryVariables = Exact<{
  residentId: Scalars['String']['input'];
}>;


export type GetResidentIdentityProfileQuery = { __typename?: 'Query', getResidentById?: { __typename?: 'ResidentType', residentId: string, mrn: string, firstName: string, lastName: string, room?: string | null, gender: Gender, birthDate: any, mobilityLevel: MobilityLevel, emergencyContacts: Array<{ __typename?: 'EmergencyContactType', id: string, name: string, phone: string, relation: string }> } | null };

export type CancelTaskMutationVariables = Exact<{
  id: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type CancelTaskMutation = { __typename?: 'Mutation', cancelTask: { __typename?: 'Task', id: string } };

export type ReactivateTaskMutationVariables = Exact<{
  taskId: Scalars['String']['input'];
}>;


export type ReactivateTaskMutation = { __typename?: 'Mutation', reactivateTask: { __typename?: 'Task', id: string } };

export type GetTodayTasksQueryVariables = Exact<{
  todayDate?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type GetTodayTasksQuery = { __typename?: 'Query', taskList: Array<{ __typename?: 'Task', id: string, title: string, priority: TaskPriority, description?: string | null, status: TaskStatus, dueAt?: any | null, assignedResident?: { __typename?: 'TaskResidentProfile', firstName: string, lastName: string } | null, assignedCaregiver?: { __typename?: 'TaskCaregiverProfile', firstName: string, lastName: string } | null, checklist: Array<{ __typename?: 'TaskChecklistItem', id: string, label: string }> }> };

export type SearchResidentsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchResidentsQuery = { __typename?: 'Query', residentList: Array<{ __typename?: 'ResidentType', residentId: string, firstName: string, lastName: string }> };


export const AuthenticateUserDocument = gql`
    mutation AuthenticateUser($email: String!, $password: String!) {
  authenticateUser(input: {email: $email, password: $password}) {
    token
    user {
      userId
      agencyId
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
export const CompleteTaskDocument = gql`
    mutation CompleteTask($input: CompleteTaskInputGql!) {
  completeTask(input: $input) {
    id
    status
  }
}
    `;
export type CompleteTaskMutationFn = Apollo.MutationFunction<CompleteTaskMutation, CompleteTaskMutationVariables>;

/**
 * __useCompleteTaskMutation__
 *
 * To run a mutation, you first call `useCompleteTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeTaskMutation, { data, loading, error }] = useCompleteTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCompleteTaskMutation(baseOptions?: Apollo.MutationHookOptions<CompleteTaskMutation, CompleteTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteTaskMutation, CompleteTaskMutationVariables>(CompleteTaskDocument, options);
      }
export type CompleteTaskMutationHookResult = ReturnType<typeof useCompleteTaskMutation>;
export type CompleteTaskMutationResult = Apollo.MutationResult<CompleteTaskMutation>;
export type CompleteTaskMutationOptions = Apollo.BaseMutationOptions<CompleteTaskMutation, CompleteTaskMutationVariables>;
export const CancelResidentTaskDocument = gql`
    mutation CancelResidentTask($id: String!, $reason: String) {
  cancelTask(id: $id, reason: $reason) {
    id
    status
  }
}
    `;
export type CancelResidentTaskMutationFn = Apollo.MutationFunction<CancelResidentTaskMutation, CancelResidentTaskMutationVariables>;

/**
 * __useCancelResidentTaskMutation__
 *
 * To run a mutation, you first call `useCancelResidentTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelResidentTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelResidentTaskMutation, { data, loading, error }] = useCancelResidentTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useCancelResidentTaskMutation(baseOptions?: Apollo.MutationHookOptions<CancelResidentTaskMutation, CancelResidentTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelResidentTaskMutation, CancelResidentTaskMutationVariables>(CancelResidentTaskDocument, options);
      }
export type CancelResidentTaskMutationHookResult = ReturnType<typeof useCancelResidentTaskMutation>;
export type CancelResidentTaskMutationResult = Apollo.MutationResult<CancelResidentTaskMutation>;
export type CancelResidentTaskMutationOptions = Apollo.BaseMutationOptions<CancelResidentTaskMutation, CancelResidentTaskMutationVariables>;
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
export const ResidentSuggestionsDocument = gql`
    query ResidentSuggestions($search: String) {
  residentList(search: $search) {
    residentId
    mrn
    firstName
    lastName
  }
}
    `;

/**
 * __useResidentSuggestionsQuery__
 *
 * To run a query within a React component, call `useResidentSuggestionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useResidentSuggestionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResidentSuggestionsQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useResidentSuggestionsQuery(baseOptions?: Apollo.QueryHookOptions<ResidentSuggestionsQuery, ResidentSuggestionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResidentSuggestionsQuery, ResidentSuggestionsQueryVariables>(ResidentSuggestionsDocument, options);
      }
export function useResidentSuggestionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResidentSuggestionsQuery, ResidentSuggestionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResidentSuggestionsQuery, ResidentSuggestionsQueryVariables>(ResidentSuggestionsDocument, options);
        }
// @ts-ignore
export function useResidentSuggestionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ResidentSuggestionsQuery, ResidentSuggestionsQueryVariables>): Apollo.UseSuspenseQueryResult<ResidentSuggestionsQuery, ResidentSuggestionsQueryVariables>;
export function useResidentSuggestionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ResidentSuggestionsQuery, ResidentSuggestionsQueryVariables>): Apollo.UseSuspenseQueryResult<ResidentSuggestionsQuery | undefined, ResidentSuggestionsQueryVariables>;
export function useResidentSuggestionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ResidentSuggestionsQuery, ResidentSuggestionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ResidentSuggestionsQuery, ResidentSuggestionsQueryVariables>(ResidentSuggestionsDocument, options);
        }
export type ResidentSuggestionsQueryHookResult = ReturnType<typeof useResidentSuggestionsQuery>;
export type ResidentSuggestionsLazyQueryHookResult = ReturnType<typeof useResidentSuggestionsLazyQuery>;
export type ResidentSuggestionsSuspenseQueryHookResult = ReturnType<typeof useResidentSuggestionsSuspenseQuery>;
export type ResidentSuggestionsQueryResult = Apollo.QueryResult<ResidentSuggestionsQuery, ResidentSuggestionsQueryVariables>;
export const GetResidentByIdDocument = gql`
    query GetResidentById($residentId: String!) {
  getResidentById(residentId: $residentId) {
    residentId
    mrn
    firstName
    lastName
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
export const GetTaskListResidentDocument = gql`
    query GetTaskListResident($residentId: String, $startDate: DateTime, $endDate: DateTime, $status: String) {
  taskList(
    residentId: $residentId
    startDate: $startDate
    endDate: $endDate
    status: $status
  ) {
    id
    title
    description
    status
    priority
    dueAt
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
 * __useGetTaskListResidentQuery__
 *
 * To run a query within a React component, call `useGetTaskListResidentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTaskListResidentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTaskListResidentQuery({
 *   variables: {
 *      residentId: // value for 'residentId'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetTaskListResidentQuery(baseOptions?: Apollo.QueryHookOptions<GetTaskListResidentQuery, GetTaskListResidentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTaskListResidentQuery, GetTaskListResidentQueryVariables>(GetTaskListResidentDocument, options);
      }
export function useGetTaskListResidentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTaskListResidentQuery, GetTaskListResidentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTaskListResidentQuery, GetTaskListResidentQueryVariables>(GetTaskListResidentDocument, options);
        }
// @ts-ignore
export function useGetTaskListResidentSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTaskListResidentQuery, GetTaskListResidentQueryVariables>): Apollo.UseSuspenseQueryResult<GetTaskListResidentQuery, GetTaskListResidentQueryVariables>;
export function useGetTaskListResidentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTaskListResidentQuery, GetTaskListResidentQueryVariables>): Apollo.UseSuspenseQueryResult<GetTaskListResidentQuery | undefined, GetTaskListResidentQueryVariables>;
export function useGetTaskListResidentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTaskListResidentQuery, GetTaskListResidentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTaskListResidentQuery, GetTaskListResidentQueryVariables>(GetTaskListResidentDocument, options);
        }
export type GetTaskListResidentQueryHookResult = ReturnType<typeof useGetTaskListResidentQuery>;
export type GetTaskListResidentLazyQueryHookResult = ReturnType<typeof useGetTaskListResidentLazyQuery>;
export type GetTaskListResidentSuspenseQueryHookResult = ReturnType<typeof useGetTaskListResidentSuspenseQuery>;
export type GetTaskListResidentQueryResult = Apollo.QueryResult<GetTaskListResidentQuery, GetTaskListResidentQueryVariables>;
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
export const GetResidentIdentityProfileDocument = gql`
    query GetResidentIdentityProfile($residentId: String!) {
  getResidentById(residentId: $residentId) {
    residentId
    mrn
    firstName
    lastName
    room
    gender
    birthDate
    emergencyContacts {
      id
      name
      phone
      relation
    }
    mobilityLevel
  }
}
    `;

/**
 * __useGetResidentIdentityProfileQuery__
 *
 * To run a query within a React component, call `useGetResidentIdentityProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetResidentIdentityProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetResidentIdentityProfileQuery({
 *   variables: {
 *      residentId: // value for 'residentId'
 *   },
 * });
 */
export function useGetResidentIdentityProfileQuery(baseOptions: Apollo.QueryHookOptions<GetResidentIdentityProfileQuery, GetResidentIdentityProfileQueryVariables> & ({ variables: GetResidentIdentityProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetResidentIdentityProfileQuery, GetResidentIdentityProfileQueryVariables>(GetResidentIdentityProfileDocument, options);
      }
export function useGetResidentIdentityProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetResidentIdentityProfileQuery, GetResidentIdentityProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetResidentIdentityProfileQuery, GetResidentIdentityProfileQueryVariables>(GetResidentIdentityProfileDocument, options);
        }
// @ts-ignore
export function useGetResidentIdentityProfileSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetResidentIdentityProfileQuery, GetResidentIdentityProfileQueryVariables>): Apollo.UseSuspenseQueryResult<GetResidentIdentityProfileQuery, GetResidentIdentityProfileQueryVariables>;
export function useGetResidentIdentityProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetResidentIdentityProfileQuery, GetResidentIdentityProfileQueryVariables>): Apollo.UseSuspenseQueryResult<GetResidentIdentityProfileQuery | undefined, GetResidentIdentityProfileQueryVariables>;
export function useGetResidentIdentityProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetResidentIdentityProfileQuery, GetResidentIdentityProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetResidentIdentityProfileQuery, GetResidentIdentityProfileQueryVariables>(GetResidentIdentityProfileDocument, options);
        }
export type GetResidentIdentityProfileQueryHookResult = ReturnType<typeof useGetResidentIdentityProfileQuery>;
export type GetResidentIdentityProfileLazyQueryHookResult = ReturnType<typeof useGetResidentIdentityProfileLazyQuery>;
export type GetResidentIdentityProfileSuspenseQueryHookResult = ReturnType<typeof useGetResidentIdentityProfileSuspenseQuery>;
export type GetResidentIdentityProfileQueryResult = Apollo.QueryResult<GetResidentIdentityProfileQuery, GetResidentIdentityProfileQueryVariables>;
export const CancelTaskDocument = gql`
    mutation CancelTask($id: String!, $reason: String) {
  cancelTask(id: $id, reason: $reason) {
    id
  }
}
    `;
export type CancelTaskMutationFn = Apollo.MutationFunction<CancelTaskMutation, CancelTaskMutationVariables>;

/**
 * __useCancelTaskMutation__
 *
 * To run a mutation, you first call `useCancelTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelTaskMutation, { data, loading, error }] = useCancelTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useCancelTaskMutation(baseOptions?: Apollo.MutationHookOptions<CancelTaskMutation, CancelTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelTaskMutation, CancelTaskMutationVariables>(CancelTaskDocument, options);
      }
export type CancelTaskMutationHookResult = ReturnType<typeof useCancelTaskMutation>;
export type CancelTaskMutationResult = Apollo.MutationResult<CancelTaskMutation>;
export type CancelTaskMutationOptions = Apollo.BaseMutationOptions<CancelTaskMutation, CancelTaskMutationVariables>;
export const ReactivateTaskDocument = gql`
    mutation ReactivateTask($taskId: String!) {
  reactivateTask(taskId: $taskId) {
    id
  }
}
    `;
export type ReactivateTaskMutationFn = Apollo.MutationFunction<ReactivateTaskMutation, ReactivateTaskMutationVariables>;

/**
 * __useReactivateTaskMutation__
 *
 * To run a mutation, you first call `useReactivateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReactivateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reactivateTaskMutation, { data, loading, error }] = useReactivateTaskMutation({
 *   variables: {
 *      taskId: // value for 'taskId'
 *   },
 * });
 */
export function useReactivateTaskMutation(baseOptions?: Apollo.MutationHookOptions<ReactivateTaskMutation, ReactivateTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReactivateTaskMutation, ReactivateTaskMutationVariables>(ReactivateTaskDocument, options);
      }
export type ReactivateTaskMutationHookResult = ReturnType<typeof useReactivateTaskMutation>;
export type ReactivateTaskMutationResult = Apollo.MutationResult<ReactivateTaskMutation>;
export type ReactivateTaskMutationOptions = Apollo.BaseMutationOptions<ReactivateTaskMutation, ReactivateTaskMutationVariables>;
export const GetTodayTasksDocument = gql`
    query GetTodayTasks($todayDate: DateTime) {
  taskList(dueAt: $todayDate) {
    id
    title
    priority
    description
    status
    dueAt
    assignedResident {
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
 * __useGetTodayTasksQuery__
 *
 * To run a query within a React component, call `useGetTodayTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTodayTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTodayTasksQuery({
 *   variables: {
 *      todayDate: // value for 'todayDate'
 *   },
 * });
 */
export function useGetTodayTasksQuery(baseOptions?: Apollo.QueryHookOptions<GetTodayTasksQuery, GetTodayTasksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTodayTasksQuery, GetTodayTasksQueryVariables>(GetTodayTasksDocument, options);
      }
export function useGetTodayTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTodayTasksQuery, GetTodayTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTodayTasksQuery, GetTodayTasksQueryVariables>(GetTodayTasksDocument, options);
        }
// @ts-ignore
export function useGetTodayTasksSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTodayTasksQuery, GetTodayTasksQueryVariables>): Apollo.UseSuspenseQueryResult<GetTodayTasksQuery, GetTodayTasksQueryVariables>;
export function useGetTodayTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTodayTasksQuery, GetTodayTasksQueryVariables>): Apollo.UseSuspenseQueryResult<GetTodayTasksQuery | undefined, GetTodayTasksQueryVariables>;
export function useGetTodayTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTodayTasksQuery, GetTodayTasksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTodayTasksQuery, GetTodayTasksQueryVariables>(GetTodayTasksDocument, options);
        }
export type GetTodayTasksQueryHookResult = ReturnType<typeof useGetTodayTasksQuery>;
export type GetTodayTasksLazyQueryHookResult = ReturnType<typeof useGetTodayTasksLazyQuery>;
export type GetTodayTasksSuspenseQueryHookResult = ReturnType<typeof useGetTodayTasksSuspenseQuery>;
export type GetTodayTasksQueryResult = Apollo.QueryResult<GetTodayTasksQuery, GetTodayTasksQueryVariables>;
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
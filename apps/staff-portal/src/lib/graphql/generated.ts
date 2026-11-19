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

export type AssignCareTaskInput = {
  careTaskId: Scalars['ID']['input'];
  caregiverId: Scalars['ID']['input'];
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

export type CancelCareTaskInput = {
  careTaskId: Scalars['ID']['input'];
};

export type CareTask = {
  __typename?: 'CareTask';
  assignedCaregiverId?: Maybe<Scalars['ID']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  priority: CareTaskPriority;
  residentId?: Maybe<Scalars['ID']['output']>;
  status: CareTaskStatus;
  title: Scalars['String']['output'];
};

export type CareTaskListItem = {
  __typename?: 'CareTaskListItem';
  dueTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  priority: CareTaskPriority;
  status: CareTaskStatus;
  title: Scalars['String']['output'];
};

/** The priority level of a care task. */
export enum CareTaskPriority {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Normal = 'NORMAL'
}

/** The current lifecycle status of a care task. */
export enum CareTaskStatus {
  Assigned = 'ASSIGNED',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Missed = 'MISSED',
  NeedAssistance = 'NEED_ASSISTANCE',
  Overdue = 'OVERDUE',
  Planned = 'PLANNED',
  UnableToComplete = 'UNABLE_TO_COMPLETE'
}

export type CertificationType = {
  __typename?: 'CertificationType';
  id: Scalars['ID']['output'];
  issuer: Scalars['String']['output'];
  name: Scalars['String']['output'];
  validFrom: Scalars['DateTime']['output'];
  validTo?: Maybe<Scalars['DateTime']['output']>;
};

export type ChangeCareTaskPriorityInput = {
  careTaskId: Scalars['ID']['input'];
  newPriority: CareTaskPriority;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CompleteCareTaskInput = {
  careTaskId: Scalars['ID']['input'];
  completionNote?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCareTaskInput = {
  caregiverId?: InputMaybe<Scalars['ID']['input']>;
  description: Scalars['String']['input'];
  dueTime: Scalars['String']['input'];
  priority: Scalars['String']['input'];
  residentId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type EmergencyContactInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  relation: Scalars['String']['input'];
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

export enum MobilityLevel {
  Assisted = 'Assisted',
  Independent = 'Independent',
  Memory = 'Memory'
}

export type Mutation = {
  __typename?: 'Mutation';
  addResidentAllergy: ResidentType;
  addResidentMedication: ResidentType;
  assignCareTask: CareTask;
  authenticateUser: AuthResultGql;
  cancelCareTask: CareTask;
  changeCareTaskPriority: CareTask;
  changePassword: Scalars['Boolean']['output'];
  completeCareTask: CareTask;
  createCareTask: CareTask;
  dischargeResident: ResidentType;
  registerCaregiver: StaffType;
  registerResident: ResidentType;
  registerUser: User;
  rescheduleCareTask: CareTask;
  updateCareTask: CareTask;
  updateCaregiverContact: StaffType;
  updateEmergencyContacts: ResidentType;
  updateResidentIdentity: ResidentType;
};


export type MutationAddResidentAllergyArgs = {
  input: AddResidentAllergyInput;
};


export type MutationAddResidentMedicationArgs = {
  input: AddResidentMedicationInput;
};


export type MutationAssignCareTaskArgs = {
  input: AssignCareTaskInput;
};


export type MutationAuthenticateUserArgs = {
  input: AuthenticateInput;
};


export type MutationCancelCareTaskArgs = {
  input: CancelCareTaskInput;
};


export type MutationChangeCareTaskPriorityArgs = {
  input: ChangeCareTaskPriorityInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCompleteCareTaskArgs = {
  input: CompleteCareTaskInput;
};


export type MutationCreateCareTaskArgs = {
  input: CreateCareTaskInput;
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


export type MutationRescheduleCareTaskArgs = {
  input: RescheduleCareTaskInput;
};


export type MutationUpdateCareTaskArgs = {
  input: UpdateCareTaskInput;
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

export type Query = {
  __typename?: 'Query';
  careTaskDetails?: Maybe<CareTask>;
  caregiverById?: Maybe<StaffType>;
  caregiverList: Array<StaffType>;
  getResidentById?: Maybe<ResidentType>;
  me?: Maybe<User>;
  residentList: Array<ResidentType>;
  todayCareTasks: Array<CareTaskListItem>;
};


export type QueryCareTaskDetailsArgs = {
  id: Scalars['String']['input'];
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

export type RescheduleCareTaskInput = {
  careTaskId: Scalars['ID']['input'];
  newDueTime: Scalars['DateTime']['input'];
};

export enum ResidentStatus {
  Active = 'Active',
  Discharged = 'Discharged'
}

export type ResidentType = {
  __typename?: 'ResidentType';
  birthDate: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  firstName: Scalars['String']['output'];
  gender: Gender;
  lastName: Scalars['String']['output'];
  mobilityLevel: MobilityLevel;
  mrn: Scalars['String']['output'];
  residentId: Scalars['ID']['output'];
  room?: Maybe<Scalars['String']['output']>;
  status: ResidentStatus;
  updatedAt: Scalars['DateTime']['output'];
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

export type UpdateCareTaskInput = {
  caregiverId: Scalars['String']['input'];
  description: Scalars['String']['input'];
  dueTime: Scalars['DateTime']['input'];
  id: Scalars['ID']['input'];
  priority: Scalars['String']['input'];
  status: Scalars['String']['input'];
  title: Scalars['String']['input'];
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

export type UpdateTaskMutationVariables = Exact<{
  input: UpdateCareTaskInput;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateCareTask: { __typename?: 'CareTask', id: string } };

export type CreateCareTaskFromResidentProfileMutationVariables = Exact<{
  input: CreateCareTaskInput;
}>;


export type CreateCareTaskFromResidentProfileMutation = { __typename?: 'Mutation', createCareTask: { __typename?: 'CareTask', id: string, status: CareTaskStatus, priority: CareTaskPriority } };

export type ResidentListQueryVariables = Exact<{ [key: string]: never; }>;


export type ResidentListQuery = { __typename?: 'Query', residentList: Array<{ __typename?: 'ResidentType', residentId: string, mrn: string, firstName: string, lastName: string, birthDate: any, gender: Gender, mobilityLevel: MobilityLevel, status: ResidentStatus, room?: string | null }> };

export type ResidentSuggestionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ResidentSuggestionsQuery = { __typename?: 'Query', residentList: Array<{ __typename?: 'ResidentType', residentId: string, mrn: string, firstName: string, lastName: string }> };

export type GetResidentByIdQueryVariables = Exact<{
  residentId: Scalars['String']['input'];
}>;


export type GetResidentByIdQuery = { __typename?: 'Query', getResidentById?: { __typename?: 'ResidentType', residentId: string, mrn: string, firstName: string, lastName: string } | null };

export type GetTaskListResidentQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTaskListResidentQuery = { __typename?: 'Query', todayCareTasks: Array<{ __typename?: 'CareTaskListItem', id: string, title: string, status: CareTaskStatus, priority: CareTaskPriority }> };

export type SearchCaregiversQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchCaregiversQuery = { __typename?: 'Query', caregiverList: Array<{ __typename?: 'StaffType', id: string, firstName: string, lastName: string }> };

export type GetResidentIdentityProfileQueryVariables = Exact<{
  residentId: Scalars['String']['input'];
}>;


export type GetResidentIdentityProfileQuery = { __typename?: 'Query', getResidentById?: { __typename?: 'ResidentType', residentId: string, mrn: string, firstName: string, lastName: string, room?: string | null, gender: Gender, birthDate: any, mobilityLevel: MobilityLevel } | null };

export type CreateAdHocTaskMutationVariables = Exact<{
  input: CreateCareTaskInput;
}>;


export type CreateAdHocTaskMutation = { __typename?: 'Mutation', createCareTask: { __typename?: 'CareTask', id: string } };

export type UpdateCareTaskMutationVariables = Exact<{
  input: UpdateCareTaskInput;
}>;


export type UpdateCareTaskMutation = { __typename?: 'Mutation', updateCareTask: { __typename?: 'CareTask', id: string } };

export type CompleteCareTaskMutationVariables = Exact<{
  input: CompleteCareTaskInput;
}>;


export type CompleteCareTaskMutation = { __typename?: 'Mutation', completeCareTask: { __typename?: 'CareTask', id: string } };

export type CancelCareTaskMutationVariables = Exact<{
  input: CancelCareTaskInput;
}>;


export type CancelCareTaskMutation = { __typename?: 'Mutation', cancelCareTask: { __typename?: 'CareTask', id: string } };

export type GetTodayCareTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTodayCareTasksQuery = { __typename?: 'Query', todayCareTasks: Array<{ __typename?: 'CareTaskListItem', id: string, title: string, priority: CareTaskPriority, status: CareTaskStatus }> };

export type SearchResidentsQueryVariables = Exact<{ [key: string]: never; }>;


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
export const UpdateTaskDocument = gql`
    mutation UpdateTask($input: UpdateCareTaskInput!) {
  updateCareTask(input: $input) {
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
export const CreateCareTaskFromResidentProfileDocument = gql`
    mutation CreateCareTaskFromResidentProfile($input: CreateCareTaskInput!) {
  createCareTask(input: $input) {
    id
    status
    priority
  }
}
    `;
export type CreateCareTaskFromResidentProfileMutationFn = Apollo.MutationFunction<CreateCareTaskFromResidentProfileMutation, CreateCareTaskFromResidentProfileMutationVariables>;

/**
 * __useCreateCareTaskFromResidentProfileMutation__
 *
 * To run a mutation, you first call `useCreateCareTaskFromResidentProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCareTaskFromResidentProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCareTaskFromResidentProfileMutation, { data, loading, error }] = useCreateCareTaskFromResidentProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCareTaskFromResidentProfileMutation(baseOptions?: Apollo.MutationHookOptions<CreateCareTaskFromResidentProfileMutation, CreateCareTaskFromResidentProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCareTaskFromResidentProfileMutation, CreateCareTaskFromResidentProfileMutationVariables>(CreateCareTaskFromResidentProfileDocument, options);
      }
export type CreateCareTaskFromResidentProfileMutationHookResult = ReturnType<typeof useCreateCareTaskFromResidentProfileMutation>;
export type CreateCareTaskFromResidentProfileMutationResult = Apollo.MutationResult<CreateCareTaskFromResidentProfileMutation>;
export type CreateCareTaskFromResidentProfileMutationOptions = Apollo.BaseMutationOptions<CreateCareTaskFromResidentProfileMutation, CreateCareTaskFromResidentProfileMutationVariables>;
export const ResidentListDocument = gql`
    query ResidentList {
  residentList {
    residentId
    mrn
    firstName
    lastName
    birthDate
    gender
    mobilityLevel
    status
    room
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
    query ResidentSuggestions {
  residentList {
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
    query GetTaskListResident {
  todayCareTasks {
    id
    title
    status
    priority
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
export const CreateAdHocTaskDocument = gql`
    mutation CreateAdHocTask($input: CreateCareTaskInput!) {
  createCareTask(input: $input) {
    id
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
export const UpdateCareTaskDocument = gql`
    mutation UpdateCareTask($input: UpdateCareTaskInput!) {
  updateCareTask(input: $input) {
    id
  }
}
    `;
export type UpdateCareTaskMutationFn = Apollo.MutationFunction<UpdateCareTaskMutation, UpdateCareTaskMutationVariables>;

/**
 * __useUpdateCareTaskMutation__
 *
 * To run a mutation, you first call `useUpdateCareTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCareTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCareTaskMutation, { data, loading, error }] = useUpdateCareTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCareTaskMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCareTaskMutation, UpdateCareTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCareTaskMutation, UpdateCareTaskMutationVariables>(UpdateCareTaskDocument, options);
      }
export type UpdateCareTaskMutationHookResult = ReturnType<typeof useUpdateCareTaskMutation>;
export type UpdateCareTaskMutationResult = Apollo.MutationResult<UpdateCareTaskMutation>;
export type UpdateCareTaskMutationOptions = Apollo.BaseMutationOptions<UpdateCareTaskMutation, UpdateCareTaskMutationVariables>;
export const CompleteCareTaskDocument = gql`
    mutation CompleteCareTask($input: CompleteCareTaskInput!) {
  completeCareTask(input: $input) {
    id
  }
}
    `;
export type CompleteCareTaskMutationFn = Apollo.MutationFunction<CompleteCareTaskMutation, CompleteCareTaskMutationVariables>;

/**
 * __useCompleteCareTaskMutation__
 *
 * To run a mutation, you first call `useCompleteCareTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteCareTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeCareTaskMutation, { data, loading, error }] = useCompleteCareTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCompleteCareTaskMutation(baseOptions?: Apollo.MutationHookOptions<CompleteCareTaskMutation, CompleteCareTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteCareTaskMutation, CompleteCareTaskMutationVariables>(CompleteCareTaskDocument, options);
      }
export type CompleteCareTaskMutationHookResult = ReturnType<typeof useCompleteCareTaskMutation>;
export type CompleteCareTaskMutationResult = Apollo.MutationResult<CompleteCareTaskMutation>;
export type CompleteCareTaskMutationOptions = Apollo.BaseMutationOptions<CompleteCareTaskMutation, CompleteCareTaskMutationVariables>;
export const CancelCareTaskDocument = gql`
    mutation CancelCareTask($input: CancelCareTaskInput!) {
  cancelCareTask(input: $input) {
    id
  }
}
    `;
export type CancelCareTaskMutationFn = Apollo.MutationFunction<CancelCareTaskMutation, CancelCareTaskMutationVariables>;

/**
 * __useCancelCareTaskMutation__
 *
 * To run a mutation, you first call `useCancelCareTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelCareTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelCareTaskMutation, { data, loading, error }] = useCancelCareTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCancelCareTaskMutation(baseOptions?: Apollo.MutationHookOptions<CancelCareTaskMutation, CancelCareTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelCareTaskMutation, CancelCareTaskMutationVariables>(CancelCareTaskDocument, options);
      }
export type CancelCareTaskMutationHookResult = ReturnType<typeof useCancelCareTaskMutation>;
export type CancelCareTaskMutationResult = Apollo.MutationResult<CancelCareTaskMutation>;
export type CancelCareTaskMutationOptions = Apollo.BaseMutationOptions<CancelCareTaskMutation, CancelCareTaskMutationVariables>;
export const GetTodayCareTasksDocument = gql`
    query GetTodayCareTasks {
  todayCareTasks {
    id
    title
    priority
    status
  }
}
    `;

/**
 * __useGetTodayCareTasksQuery__
 *
 * To run a query within a React component, call `useGetTodayCareTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTodayCareTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTodayCareTasksQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTodayCareTasksQuery(baseOptions?: Apollo.QueryHookOptions<GetTodayCareTasksQuery, GetTodayCareTasksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTodayCareTasksQuery, GetTodayCareTasksQueryVariables>(GetTodayCareTasksDocument, options);
      }
export function useGetTodayCareTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTodayCareTasksQuery, GetTodayCareTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTodayCareTasksQuery, GetTodayCareTasksQueryVariables>(GetTodayCareTasksDocument, options);
        }
// @ts-ignore
export function useGetTodayCareTasksSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTodayCareTasksQuery, GetTodayCareTasksQueryVariables>): Apollo.UseSuspenseQueryResult<GetTodayCareTasksQuery, GetTodayCareTasksQueryVariables>;
export function useGetTodayCareTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTodayCareTasksQuery, GetTodayCareTasksQueryVariables>): Apollo.UseSuspenseQueryResult<GetTodayCareTasksQuery | undefined, GetTodayCareTasksQueryVariables>;
export function useGetTodayCareTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTodayCareTasksQuery, GetTodayCareTasksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTodayCareTasksQuery, GetTodayCareTasksQueryVariables>(GetTodayCareTasksDocument, options);
        }
export type GetTodayCareTasksQueryHookResult = ReturnType<typeof useGetTodayCareTasksQuery>;
export type GetTodayCareTasksLazyQueryHookResult = ReturnType<typeof useGetTodayCareTasksLazyQuery>;
export type GetTodayCareTasksSuspenseQueryHookResult = ReturnType<typeof useGetTodayCareTasksSuspenseQuery>;
export type GetTodayCareTasksQueryResult = Apollo.QueryResult<GetTodayCareTasksQuery, GetTodayCareTasksQueryVariables>;
export const SearchResidentsDocument = gql`
    query SearchResidents {
  residentList {
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
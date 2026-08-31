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

export type AuthResultGql = {
  __typename?: 'AuthResultGQL';
  token: Scalars['String']['output'];
  user: User;
};

export type AuthenticateInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
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

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
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
  authenticateUser: AuthResultGql;
  changePassword: Scalars['Boolean']['output'];
  createCareTask: CareTask;
  dischargeResident: ResidentType;
  registerCaregiver: StaffType;
  registerResident: ResidentType;
  registerUser: User;
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


export type MutationAuthenticateUserArgs = {
  input: AuthenticateInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
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
  caregiverById?: Maybe<StaffType>;
  caregiverList: Array<StaffType>;
  getResidentById?: Maybe<ResidentType>;
  me?: Maybe<User>;
  residentList: Array<ResidentType>;
  taskById?: Maybe<CareTask>;
  todayCareTasks: Array<CareTaskListItem>;
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


export type QueryTaskByIdArgs = {
  id: Scalars['String']['input'];
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
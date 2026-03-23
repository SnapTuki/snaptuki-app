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

export type EmergencyContactType = {
  __typename?: 'EmergencyContactType';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
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
  Assisted = 'ASSISTED',
  Independent = 'INDEPENDENT',
  Memory = 'MEMORY'
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
  deactivateCaregiver: CaregiverType;
  registerCaregiver: CaregiverType;
  registerResident: ResidentType;
  registerUser: User;
  updateCaregiverContact: CaregiverType;
  updateResidentMedicalProfile: ResidentType;
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


export type MutationDeactivateCaregiverArgs = {
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


export type MutationUpdateResidentMedicalProfileArgs = {
  input: UpdateResidentMedicalProfileInput;
};

export type Query = {
  __typename?: 'Query';
  caregiverById?: Maybe<CaregiverType>;
  caregiverList: Array<CaregiverType>;
  me?: Maybe<User>;
  residentById?: Maybe<ResidentType>;
  residentList: Array<ResidentType>;
};


export type QueryCaregiverByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryResidentByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryResidentListArgs = {
  mobilityLevel?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
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
  birthDate: Scalars['DateTime']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  gender: Gender;
  id: Scalars['ID']['input'];
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

export type ResidentType = {
  __typename?: 'ResidentType';
  allergies: Array<AllergyType>;
  birthDate: Scalars['DateTime']['output'];
  careLevel: MobilityLevel;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  emergencyContacts: Array<EmergencyContactType>;
  firstName: Scalars['String']['output'];
  gender: Gender;
  guardianUserId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  medications: Array<MedicationType>;
  mrn: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  primaryCaregiverId?: Maybe<Scalars['String']['output']>;
  room?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum Role {
  AgencyStaff = 'AGENCY_STAFF',
  Caregiver = 'CAREGIVER',
  Supervisor = 'SUPERVISOR',
  SuperAdmin = 'SUPER_ADMIN'
}

export type UpdateCaregiverContactInputGql = {
  email: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateResidentMedicalProfileInput = {
  id: Scalars['ID']['input'];
  mobilityLevel: MobilityLevel;
  room?: InputMaybe<Scalars['String']['input']>;
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
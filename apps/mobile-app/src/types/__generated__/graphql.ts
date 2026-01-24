export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date; output: Date; }
};

export type Booking = {
  __typename: 'Booking';
  caregiverId: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  elderId: Scalars['ID']['output'];
  endTime: Scalars['DateTime']['output'];
  familyMemberId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  notes: Maybe<Scalars['String']['output']>;
  serviceId: Scalars['ID']['output'];
  startTime: Scalars['DateTime']['output'];
  status: BookingStatus;
  totalPrice: Scalars['Float']['output'];
};

export enum BookingStatus {
  Accepted = 'ACCEPTED',
  Cancled = 'CANCLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING'
}

export type CareTask = {
  __typename: 'CareTask';
  caregiverNotes: Maybe<Scalars['String']['output']>;
  completedAt: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  status: CareTaskStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CareTaskBook = {
  __typename: 'CareTaskBook';
  bookingId: Scalars['Int']['output'];
  caregiverId: Scalars['Int']['output'];
  completedTasks: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  elderId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  progressPercentage: Scalars['Int']['output'];
  status: CareTaskBookStatus;
  tasks: Array<CareTask>;
  totalTasks: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum CareTaskBookStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED'
}

export enum CareTaskStatus {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING',
  Skipped = 'SKIPPED'
}

export type CompleteRegisterationInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRole;
};

export type CreateElderProfileInput = {
  address: Scalars['String']['input'];
  dateOfBirth: Scalars['DateTime']['input'];
  familyMemberId: Scalars['Int']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  medicalNotes: Scalars['String']['input'];
  mobilityLevel: MobilityLevel;
  phone: Scalars['String']['input'];
  relationship: Scalars['String']['input'];
};

export type CreateFamilyProfileInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  dateOfBirth: Scalars['DateTime']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
};

export type CreateServiceCategoryInput = {
  categoryName: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type CreateServiceTaskInput = {
  categoryId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  serviceName: Scalars['String']['input'];
};

export type ElderProfile = {
  __typename: 'ElderProfile';
  address: Maybe<Scalars['String']['output']>;
  city: Maybe<Scalars['String']['output']>;
  country: Maybe<Scalars['String']['output']>;
  dateOfBirth: Maybe<Scalars['DateTime']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  medicalNotes: Maybe<Scalars['String']['output']>;
  mobilityLevel: MobilityLevel;
  notes: Maybe<Scalars['String']['output']>;
  phone: Maybe<Scalars['String']['output']>;
  postalCode: Maybe<Scalars['String']['output']>;
};

export type ElderProfileCard = {
  __typename: 'ElderProfileCard';
  dateOfBirth: Scalars['DateTime']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  mobilityLevel: MobilityLevel;
};

export type ElderProfileData = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  dateOfBirth: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  medicalNotes: Scalars['String']['input'];
  mobilityLevel: MobilityLevel;
  phone: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
};

export type FamilyElderRelationship = {
  __typename: 'FamilyElderRelationship';
  createdAt: Scalars['DateTime']['output'];
  isPrimaryContact: Scalars['Boolean']['output'];
  relationship: Maybe<Scalars['String']['output']>;
};

export type FamilyProfile = {
  __typename: 'FamilyProfile';
  createdAt: Scalars['DateTime']['output'];
  elders: Array<ManagedElder>;
  id: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export type LoginCredentials = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ManagedElder = {
  __typename: 'ManagedElder';
  dateOfBirth: Maybe<Scalars['DateTime']['output']>;
  elderId: Scalars['ID']['output'];
  firstName: Scalars['String']['output'];
  isPrimaryContact: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  mobilityLevel: Scalars['String']['output'];
  relationship: Maybe<FamilyElderRelationship>;
};

/** Mobility level of the elder */
export enum MobilityLevel {
  Independent = 'independent',
  NeedsAssistant = 'needs_assistant',
  Wheelchair = 'wheelchair'
}

export type Mutation = {
  __typename: 'Mutation';
  cancleBooking: Booking;
  completeBooking: Booking;
  completeCareTaskBook: CareTaskBook;
  completeRegisteration: UserWithToken;
  confirmBooking: Booking;
  createElderAndLink: ElderProfile;
  createElderProfile: ElderProfile;
  createFamilyProfile: FamilyProfile;
  createNewBooking: Booking;
  createServiceCategory: ServiceCategory;
  createServiceTask: ServiceTask;
  deleteServiceCategory: Scalars['Boolean']['output'];
  deleteServiceTask: Scalars['Boolean']['output'];
  linkExistingElder: Scalars['Boolean']['output'];
  login: UserWithToken;
  removeElderProfile: Scalars['Boolean']['output'];
  requestRegisterationOtp: OtpRegisteration;
  rescheduelBooking: Booking;
  unlinkElder: Scalars['Boolean']['output'];
  updateCareTaskStatus: CareTask;
  updateElderProfile: ElderProfile;
  updateServiceCategory: ServiceCategory;
  updateServiceTask: ServiceTask;
  verifyEmail: Scalars['Boolean']['output'];
};


export type MutationCancleBookingArgs = {
  bookingId: Scalars['ID']['input'];
};


export type MutationCompleteBookingArgs = {
  bookingId: Scalars['ID']['input'];
};


export type MutationCompleteCareTaskBookArgs = {
  taskBookId: Scalars['Int']['input'];
};


export type MutationCompleteRegisterationArgs = {
  data: CompleteRegisterationInput;
};


export type MutationConfirmBookingArgs = {
  bookingId: Scalars['ID']['input'];
};


export type MutationCreateElderAndLinkArgs = {
  data: ElderProfileData;
};


export type MutationCreateElderProfileArgs = {
  input: CreateElderProfileInput;
};


export type MutationCreateFamilyProfileArgs = {
  data: CreateFamilyProfileInput;
};


export type MutationCreateNewBookingArgs = {
  data: NewBookingInput;
};


export type MutationCreateServiceCategoryArgs = {
  data: CreateServiceCategoryInput;
};


export type MutationCreateServiceTaskArgs = {
  data: CreateServiceTaskInput;
};


export type MutationDeleteServiceCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};


export type MutationDeleteServiceTaskArgs = {
  taskId: Scalars['ID']['input'];
};


export type MutationLinkExistingElderArgs = {
  elderId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  credentials: LoginCredentials;
};


export type MutationRemoveElderProfileArgs = {
  elderId: Scalars['Int']['input'];
};


export type MutationRequestRegisterationOtpArgs = {
  email: Scalars['String']['input'];
};


export type MutationRescheduelBookingArgs = {
  bookingId: Scalars['ID']['input'];
  data: UpdatedBookingScheduelInput;
};


export type MutationUnlinkElderArgs = {
  elderId: Scalars['ID']['input'];
};


export type MutationUpdateCareTaskStatusArgs = {
  data: UpdateCareTaskStatusInput;
};


export type MutationUpdateElderProfileArgs = {
  elderId: Scalars['Int']['input'];
  input: UpdateElderProfileInput;
};


export type MutationUpdateServiceCategoryArgs = {
  categoryId: Scalars['ID']['input'];
  data: UpdateServiceCategoryInput;
};


export type MutationUpdateServiceTaskArgs = {
  data: UpdateServiceTaskInput;
  taskId: Scalars['ID']['input'];
};


export type MutationVerifyEmailArgs = {
  data: VerifyEmailInput;
};

export type NewBookingInput = {
  caregiverId: Scalars['ID']['input'];
  elderId: Scalars['ID']['input'];
  endTime: Scalars['DateTime']['input'];
  familyMemberId: Scalars['ID']['input'];
  notes: Scalars['String']['input'];
  serviceId: Scalars['ID']['input'];
  startTime: Scalars['DateTime']['input'];
  totalPrice: Scalars['Float']['input'];
};

export type OtpRegisteration = {
  __typename: 'OtpRegisteration';
  email: Scalars['String']['output'];
  msg: Scalars['String']['output'];
  otpCode: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Query = {
  __typename: 'Query';
  getAllBookings: Array<Booking>;
  getAllServiceCategories: Array<ServiceCategory>;
  getBookingDetails: Booking;
  getCareTaskBook: Maybe<CareTaskBook>;
  getCareTaskBookByBooking: Maybe<CareTaskBook>;
  getElderProfile: Maybe<ElderProfile>;
  getServiceCategory: Maybe<ServiceCategory>;
  getServiceTasksByCategory: Array<ServiceTask>;
  listMyElders: Array<ElderProfileCard>;
  me: User;
  myFamilyProfile: FamilyProfile;
  myManagedElders: Array<ElderProfile>;
};


export type QueryGetAllBookingsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetBookingDetailsArgs = {
  bookingId: Scalars['ID']['input'];
};


export type QueryGetCareTaskBookArgs = {
  taskBookId: Scalars['Int']['input'];
};


export type QueryGetCareTaskBookByBookingArgs = {
  bookingId: Scalars['Int']['input'];
};


export type QueryGetElderProfileArgs = {
  elderId: Scalars['Int']['input'];
};


export type QueryGetServiceCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};


export type QueryGetServiceTasksByCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};

export type ServiceCategory = {
  __typename: 'ServiceCategory';
  categoryId: Scalars['ID']['output'];
  categoryName: Scalars['String']['output'];
  description: Scalars['String']['output'];
  serviceTasks: Array<ServiceTask>;
};

export type ServiceTask = {
  __typename: 'ServiceTask';
  description: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  serviceId: Scalars['ID']['output'];
  serviceName: Scalars['String']['output'];
};

export type UpdateCareTaskStatusInput = {
  caregiverNotes?: InputMaybe<Scalars['String']['input']>;
  status: CareTaskStatus;
  taskId: Scalars['Int']['input'];
};

export type UpdateElderProfileInput = {
  address: Scalars['String']['input'];
  dateOfBirth: Scalars['DateTime']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  medicalNotes: Scalars['String']['input'];
  mobilityLevel: MobilityLevel;
  phone: Scalars['String']['input'];
};

export type UpdateServiceCategoryInput = {
  categoryName?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateServiceTaskInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  serviceName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatedBookingScheduelInput = {
  endTime: Scalars['DateTime']['input'];
  startTime: Scalars['DateTime']['input'];
  totalPrice: Scalars['Float']['input'];
};

export type User = {
  __typename: 'User';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  role: UserRole;
};

export enum UserRole {
  Admin = 'ADMIN',
  Caregiver = 'CAREGIVER',
  Elder = 'ELDER',
  Family = 'FAMILY'
}

export type UserWithToken = {
  __typename: 'UserWithToken';
  token: Scalars['String']['output'];
  user: User;
};

export type VerifyEmailInput = {
  email: Scalars['String']['input'];
  otpCode: Scalars['String']['input'];
};

export type LoginMutationVariables = Exact<{
  credentials: LoginCredentials;
}>;


export type LoginMutation = { login: { __typename: 'UserWithToken', token: string, user: { __typename: 'User', id: string, role: UserRole, firstName: string, lastName: string, email: string } } };

export type RequestRegisterationOtpMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type RequestRegisterationOtpMutation = { requestRegisterationOtp: { __typename: 'OtpRegisteration', email: string, otpCode: string, msg: string, success: boolean } };

export type VerifyEmailMutationVariables = Exact<{
  data: VerifyEmailInput;
}>;


export type VerifyEmailMutation = { verifyEmail: boolean };

export type CompleteRegisterationMutationVariables = Exact<{
  data: CompleteRegisterationInput;
}>;


export type CompleteRegisterationMutation = { completeRegisteration: { __typename: 'UserWithToken', token: string, user: { __typename: 'User', id: string, email: string, role: UserRole, firstName: string, lastName: string } } };

export type CreateElderProfileMutationVariables = Exact<{
  input: CreateElderProfileInput;
}>;


export type CreateElderProfileMutation = { createElderProfile: { __typename: 'ElderProfile', id: string, firstName: string, lastName: string, dateOfBirth: Date | null, mobilityLevel: MobilityLevel, address: string | null, city: string | null } };

export type UpdateElderProfileMutationVariables = Exact<{
  elderId: Scalars['Int']['input'];
  input: UpdateElderProfileInput;
}>;


export type UpdateElderProfileMutation = { updateElderProfile: { __typename: 'ElderProfile', id: string } };

export type RemoveElderProfileMutationVariables = Exact<{
  elderId: Scalars['Int']['input'];
}>;


export type RemoveElderProfileMutation = { removeElderProfile: boolean };

export type WhoIsMeQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoIsMeQuery = { me: { __typename: 'User', id: string, role: UserRole } };

export type GetAllCareServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCareServicesQuery = { getAllServiceCategories: Array<{ __typename: 'ServiceCategory', categoryId: string, categoryName: string, serviceTasks: Array<{ __typename: 'ServiceTask', serviceId: string, serviceName: string }> }> };

export type GetServiceCategoryByIdQueryVariables = Exact<{
  categoryId: Scalars['ID']['input'];
}>;


export type GetServiceCategoryByIdQuery = { getServiceTasksByCategory: Array<{ __typename: 'ServiceTask', serviceId: string, serviceName: string }> };

export type GetMyEldersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyEldersQuery = { listMyElders: Array<{ __typename: 'ElderProfileCard', id: string, firstName: string, lastName: string, dateOfBirth: Date, mobilityLevel: MobilityLevel }> };

export type GetElderProfileQueryVariables = Exact<{
  elderId: Scalars['Int']['input'];
}>;


export type GetElderProfileQuery = { getElderProfile: { __typename: 'ElderProfile', id: string, firstName: string, lastName: string, dateOfBirth: Date | null, mobilityLevel: MobilityLevel, address: string | null, city: string | null, country: string | null, phone: string | null, medicalNotes: string | null } | null };

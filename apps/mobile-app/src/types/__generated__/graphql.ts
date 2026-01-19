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
  DateTimeISO: { input: unknown; output: unknown; }
};

export type Booking = {
  __typename: 'Booking';
  caregiverId: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  elderId: Scalars['ID']['output'];
  endTime: Scalars['DateTimeISO']['output'];
  familyMemberId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  notes: Maybe<Scalars['String']['output']>;
  serviceId: Scalars['ID']['output'];
  startTime: Scalars['DateTimeISO']['output'];
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
  completedAt: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  status: CareTaskStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type CareTaskBook = {
  __typename: 'CareTaskBook';
  bookingId: Scalars['Int']['output'];
  caregiverId: Scalars['Int']['output'];
  completedTasks: Scalars['Int']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  elderId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  progressPercentage: Scalars['Int']['output'];
  status: CareTaskBookStatus;
  tasks: Array<CareTask>;
  totalTasks: Scalars['Int']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
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

export type CreateFamilyProfileInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  dateOfBirth: Scalars['DateTimeISO']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
};

export type CreateServiceCategoryInput = {
  category_name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type CreateServiceTaskInput = {
  category_id: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  service_name: Scalars['String']['input'];
};

export type ElderProfile = {
  __typename: 'ElderProfile';
  address: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTimeISO']['output'];
  date_of_birth: Maybe<Scalars['DateTimeISO']['output']>;
  first_name: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  last_name: Scalars['String']['output'];
  medical_notes: Maybe<Scalars['String']['output']>;
  mobility_level: MobilityLevel;
  notes: Maybe<Scalars['String']['output']>;
  phone: Maybe<Scalars['String']['output']>;
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
  createdAt: Scalars['DateTimeISO']['output'];
  isPrimaryContact: Scalars['Boolean']['output'];
  relationship: Maybe<Scalars['String']['output']>;
};

export type FamilyProfile = {
  __typename: 'FamilyProfile';
  createdAt: Scalars['DateTimeISO']['output'];
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
  dateOfBirth: Maybe<Scalars['DateTimeISO']['output']>;
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
  createFamilyProfile: FamilyProfile;
  createNewBooking: Booking;
  createServiceCategory: ServiceCategory;
  createServiceTask: ServiceTask;
  deleteServiceCategory: Scalars['Boolean']['output'];
  deleteServiceTask: Scalars['Boolean']['output'];
  linkExistingElder: Scalars['Boolean']['output'];
  login: UserWithToken;
  requestRegisterationOtp: OtpRegisteration;
  rescheduelBooking: Booking;
  unlinkElder: Scalars['Boolean']['output'];
  updateCareTaskStatus: CareTask;
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
  endTime: Scalars['DateTimeISO']['input'];
  familyMemberId: Scalars['ID']['input'];
  notes: Scalars['String']['input'];
  serviceId: Scalars['ID']['input'];
  startTime: Scalars['DateTimeISO']['input'];
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
  elderProfile: Maybe<ElderProfile>;
  getAllBookings: Array<Booking>;
  getAllServiceCategories: Array<ServiceCategory>;
  getBookingDetails: Booking;
  getCareTaskBook: Maybe<CareTaskBook>;
  getCareTaskBookByBooking: Maybe<CareTaskBook>;
  getServiceCategory: Maybe<ServiceCategory>;
  getServiceTasksByCategory: Array<ServiceTask>;
  me: Maybe<User>;
  myFamilyProfile: FamilyProfile;
  myManagedElders: Array<ElderProfile>;
};


export type QueryElderProfileArgs = {
  elderId: Scalars['ID']['input'];
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


export type QueryGetServiceCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};


export type QueryGetServiceTasksByCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};

export type ServiceCategory = {
  __typename: 'ServiceCategory';
  category_id: Scalars['ID']['output'];
  category_name: Scalars['String']['output'];
  created_at: Scalars['DateTimeISO']['output'];
  description: Maybe<Scalars['String']['output']>;
  is_active: Scalars['Boolean']['output'];
  servicetasks: Array<ServiceTask>;
};

export type ServiceTask = {
  __typename: 'ServiceTask';
  created_at: Scalars['DateTimeISO']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  is_active: Scalars['Boolean']['output'];
  service_name: Scalars['String']['output'];
  updated_at: Scalars['DateTimeISO']['output'];
};

export type UpdateCareTaskStatusInput = {
  caregiverNotes?: InputMaybe<Scalars['String']['input']>;
  status: CareTaskStatus;
  taskId: Scalars['Int']['input'];
};

export type UpdateServiceCategoryInput = {
  category_name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateServiceTaskInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  service_name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatedBookingScheduelInput = {
  endTime: Scalars['DateTimeISO']['input'];
  startTime: Scalars['DateTimeISO']['input'];
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

export type WhoIsMeQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoIsMeQuery = { me: { __typename: 'User', id: string, role: UserRole } | null };

export type GetAllCareServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCareServicesQuery = { getAllServiceCategories: Array<{ __typename: 'ServiceCategory', category_id: string, category_name: string, description: string | null, servicetasks: Array<{ __typename: 'ServiceTask', id: string, service_name: string }> }> };

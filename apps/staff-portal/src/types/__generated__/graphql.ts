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

/** Current availability status of the caregiver */
export enum Availability {
  Busy = 'busy',
  Offline = 'offline',
  Online = 'online'
}

/** Status of the caregiver's background check */
export enum BackgroundCheckStatus {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected'
}

export type Booking = {
  __typename: 'Booking';
  careServiceId: Scalars['Int']['output'];
  careTaskBook: Maybe<CareTaskBookSummary>;
  caregiver: CaregiverProfileCard;
  caregiverId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  elder: ElderProfile;
  elderId: Scalars['Int']['output'];
  endTime: Scalars['DateTime']['output'];
  familyMemberId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  notes: Maybe<Scalars['String']['output']>;
  startTime: Scalars['DateTime']['output'];
  status: BookingStatus;
  totalPrice: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BookingCard = {
  __typename: 'BookingCard';
  careService: ServiceTask;
  caregiver: CaregiverProfileCard;
  endTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  startTime: Scalars['DateTime']['output'];
  status: BookingStatus;
  totalPrice: Scalars['Int']['output'];
};

export enum BookingStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING'
}

export type CareTask = {
  __typename: 'CareTask';
  caregiverNotes: Maybe<Scalars['String']['output']>;
  completedAt: Maybe<Scalars['DateTime']['output']>;
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isMandatory: Scalars['Boolean']['output'];
  status: CareTaskStatus;
  title: Scalars['String']['output'];
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

export type CareTaskBookSummary = {
  __typename: 'CareTaskBookSummary';
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  tasks: Array<CareTaskSummary>;
};

export type CareTaskInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isMandatory?: Scalars['Boolean']['input'];
  status: CareTaskStatus;
  taskOrder?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};

export enum CareTaskStatus {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING',
  Skipped = 'SKIPPED'
}

export type CareTaskSummary = {
  __typename: 'CareTaskSummary';
  id: Scalars['ID']['output'];
  isMandatory: Scalars['String']['output'];
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CaregiverEducation = {
  __typename: 'CaregiverEducation';
  degree: Scalars['String']['output'];
  graduationYear: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  institution: Scalars['String']['output'];
};

export type CaregiverExperience = {
  __typename: 'CaregiverExperience';
  description: Maybe<Scalars['String']['output']>;
  endYear: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  organization: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  startYear: Scalars['Int']['output'];
};

export type CaregiverProfile = {
  __typename: 'CaregiverProfile';
  address: Maybe<Scalars['String']['output']>;
  availabilityStatus: Availability;
  backgroundCheckStatus: BackgroundCheckStatus;
  bio: Maybe<Scalars['String']['output']>;
  city: Maybe<Scalars['String']['output']>;
  completedJobsCount: Scalars['Int']['output'];
  country: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth: Maybe<Scalars['DateTime']['output']>;
  education: Array<CaregiverEducation>;
  experience: Array<CaregiverExperience>;
  firstName: Scalars['String']['output'];
  gender: Maybe<Gender>;
  hourlyRate: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  languages: Maybe<Array<Scalars['String']['output']>>;
  lastName: Scalars['String']['output'];
  offeredServices: Array<ServiceTask>;
  phoneNumber: Maybe<Scalars['String']['output']>;
  profilePhotoUrl: Maybe<Scalars['String']['output']>;
  rating: Scalars['Float']['output'];
  reviews: Array<Review>;
  skills: Array<Skill>;
  userId: Scalars['Int']['output'];
  verified: Scalars['Boolean']['output'];
};

export type CaregiverProfileCard = {
  __typename: 'CaregiverProfileCard';
  availabilityStatus: Availability;
  bio: Maybe<Scalars['String']['output']>;
  city: Maybe<Scalars['String']['output']>;
  completedJobsCount: Scalars['Int']['output'];
  firstName: Scalars['String']['output'];
  hourlyRate: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  languages: Maybe<Array<Scalars['String']['output']>>;
  lastName: Scalars['String']['output'];
  profilePhotoUrl: Maybe<Scalars['String']['output']>;
  rating: Scalars['Float']['output'];
  userId: Scalars['Int']['output'];
  verified: Scalars['Boolean']['output'];
};

export type CompleteRegisterationInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRole;
};

export type ConfirmedVisitCard = {
  __typename: 'ConfirmedVisitCard';
  elder: ElderProfile;
  endTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  startTime: Scalars['DateTime']['output'];
  status: BookingStatus;
  totalPrice: Scalars['Int']['output'];
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
  dateOfBirth: Scalars['DateTime']['output'];
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

export type FamilyMemberSummary = {
  __typename: 'FamilyMemberSummary';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
};

export type FamilyProfile = {
  __typename: 'FamilyProfile';
  address: Maybe<Scalars['String']['output']>;
  city: Maybe<Scalars['String']['output']>;
  country: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth: Maybe<Scalars['DateTime']['output']>;
  elders: Array<ManagedElder>;
  id: Scalars['ID']['output'];
  phoneNumber: Maybe<Scalars['String']['output']>;
  postalCode: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
};

/** Gender of the caregiver */
export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER',
  Pnts = 'PNTS'
}

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
  cancelBooking: Booking;
  completeBooking: Booking;
  completeCareTaskBook: CareTaskBook;
  completeRegisteration: UserWithToken;
  confirmBooking: Booking;
  createBooking: Booking;
  createElderAndLink: ElderProfile;
  createElderProfile: ElderProfile;
  createFamilyProfile: FamilyProfile;
  createServiceCategory: ServiceCategory;
  createServiceTask: ServiceTask;
  deleteServiceCategory: Scalars['Boolean']['output'];
  deleteServiceTask: Scalars['Boolean']['output'];
  linkExistingElder: Scalars['Boolean']['output'];
  login: UserWithToken;
  removeElderProfile: Scalars['Boolean']['output'];
  requestRegisterationOtp: OtpRegisteration;
  rescheduleBooking: Booking;
  unlinkElder: Scalars['Boolean']['output'];
  updateCareTaskStatus: CareTask;
  updateElderProfile: ElderProfile;
  updateFamilyMemberProfile: FamilyProfile;
  updateServiceCategory: ServiceCategory;
  updateServiceTask: ServiceTask;
  verifyEmail: Scalars['Boolean']['output'];
};


export type MutationCancelBookingArgs = {
  bookingId: Scalars['Int']['input'];
};


export type MutationCompleteBookingArgs = {
  bookingId: Scalars['Int']['input'];
};


export type MutationCompleteCareTaskBookArgs = {
  taskBookId: Scalars['Int']['input'];
};


export type MutationCompleteRegisterationArgs = {
  data: CompleteRegisterationInput;
};


export type MutationConfirmBookingArgs = {
  bookingId: Scalars['Int']['input'];
};


export type MutationCreateBookingArgs = {
  input: NewBookingInput;
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


export type MutationRescheduleBookingArgs = {
  bookingId: Scalars['Int']['input'];
  input: UpdatedBookingScheduelInput;
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


export type MutationUpdateFamilyMemberProfileArgs = {
  input: UpdateFamilyMemberProfileInput;
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
  caregiverId: Scalars['Int']['input'];
  elderId: Scalars['Int']['input'];
  endTime: Scalars['DateTime']['input'];
  familyMemberId: Scalars['Int']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  startTime: Scalars['DateTime']['input'];
  tasks: Array<CareTaskInput>;
  totalPrice: Scalars['Float']['input'];
};

export type OtpRegisteration = {
  __typename: 'OtpRegisteration';
  email: Scalars['String']['output'];
  msg: Scalars['String']['output'];
  otpCode: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type PendingRequestCard = {
  __typename: 'PendingRequestCard';
  careTaskBook: Maybe<CareTaskBookSummary>;
  createdAt: Scalars['DateTime']['output'];
  elder: ElderProfile;
  endTime: Scalars['DateTime']['output'];
  familyMember: FamilyMemberSummary;
  id: Scalars['ID']['output'];
  startTime: Scalars['DateTime']['output'];
  status: BookingStatus;
  totalPrice: Scalars['Int']['output'];
};

export type Query = {
  __typename: 'Query';
  confirmedVisits: Array<ConfirmedVisitCard>;
  getAllServiceCategories: Array<ServiceCategory>;
  getBooking: Booking;
  getCareTaskBook: Maybe<CareTaskBook>;
  getCareTaskBookByBooking: Maybe<CareTaskBook>;
  getCaregiver: Maybe<CaregiverProfile>;
  getElderProfile: Maybe<ElderProfile>;
  getServiceCategory: Maybe<ServiceCategory>;
  getServiceTasksByCategory: Array<ServiceTask>;
  listCaregivers: Array<CaregiverProfileCard>;
  listMyElders: Array<ElderProfileCard>;
  me: User;
  myBookings: Array<BookingCard>;
  myFamilyProfile: Maybe<FamilyProfile>;
  myManagedElders: Array<ElderProfile>;
  pendingBookings: Array<PendingRequestCard>;
};


export type QueryGetBookingArgs = {
  bookingId: Scalars['Int']['input'];
};


export type QueryGetCareTaskBookArgs = {
  taskBookId: Scalars['Int']['input'];
};


export type QueryGetCareTaskBookByBookingArgs = {
  bookingId: Scalars['Int']['input'];
};


export type QueryGetCaregiverArgs = {
  profileId: Scalars['Int']['input'];
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


export type QueryListCaregiversArgs = {
  city?: InputMaybe<Scalars['String']['input']>;
  offeredServiceIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  verified?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryMyBookingsArgs = {
  filter?: InputMaybe<BookingStatus>;
};

export type Review = {
  __typename: 'Review';
  comment: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  reviewerName: Maybe<Scalars['String']['output']>;
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

export type Skill = {
  __typename: 'Skill';
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
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

export type UpdateFamilyMemberProfileInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
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
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
  totalPrice?: InputMaybe<Scalars['Float']['input']>;
};

export type User = {
  __typename: 'User';
  email: Scalars['String']['output'];
  familyMemberProfile: FamilyProfile;
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

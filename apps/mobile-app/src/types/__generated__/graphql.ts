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

export type CompleteRegisterationInput = {
  birthdate: Scalars['DateTimeISO']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  otpCode: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRole;
};

export type LoginCredentials = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
  completeRegisteration: UserWithToken;
  login: UserWithToken;
  requestRegisterationOtp: OtpRegisteration;
};


export type MutationCompleteRegisterationArgs = {
  data: CompleteRegisterationInput;
};


export type MutationLoginArgs = {
  credentials: LoginCredentials;
};


export type MutationRequestRegisterationOtpArgs = {
  email: Scalars['String']['input'];
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
  me: Maybe<User>;
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

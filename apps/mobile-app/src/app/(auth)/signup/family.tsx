import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert, // Using native Alert for mobile
} from 'react-native';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';

// --- TypeScript Interfaces ---

/**
 * Defines the shape of the form's values.
 */
interface SignupFormValues {
  phoneNumber: string;
  code: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

/**
 * Props for the reusable FormInput component.
 */
interface FormInputProps {
  formikProps: FormikProps<SignupFormValues>;
  fieldName: keyof SignupFormValues; // Use keyof for type safety
  label: string;
  [key: string]: any; // To allow other TextInput props
}

/**
 * Props for the reusable FormButton component.
 */
interface FormButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

// --- Validation Schema ---
const signupValidationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Must be at least 10 digits'),
  code: Yup.string()
    .required('Verification code is required')
    .oneOf(['123456'], 'Invalid verification code (Hint: it\'s 123456)'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Please confirm your password'),
});

// --- Reusable Input Component ---
const FormInput: React.FC<FormInputProps> = ({
  formikProps,
  fieldName,
  label,
  ...textInputProps
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      onChangeText={formikProps.handleChange(fieldName)}
      onBlur={formikProps.handleBlur(fieldName)}
      value={formikProps.values[fieldName]}
      placeholderTextColor="#999"
      {...textInputProps}
    />
    {formikProps.errors[fieldName] && formikProps.touched[fieldName] && (
      <Text style={styles.errorText}>
        {formikProps.errors[fieldName]}
      </Text>
    )}
  </View>
);

// --- Reusable Button Component ---
const FormButton: React.FC<FormButtonProps> = ({ title, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.buttonDisabled]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// --- Main Signup Component ---
const FamilySignUp: React.FC = () => {
  // State to manage which step of the form is visible
  const [step, setStep] = useState(1);
  
  // State to track if the (simulated) code has been "sent"
  const [codeSent, setCodeSent] = useState(false);

  // --- Step Handlers ---

  /**
   * Step 1: Validate phone number and "send" code
   */
  const handleSendCode = async (formikProps: FormikProps<SignupFormValues>) => {
    formikProps.setFieldTouched('phoneNumber', true, false);
    await formikProps.validateField('phoneNumber');

    if (!formikProps.errors.phoneNumber) {
      console.log(
        'Simulating sending code 123456 to:',
        formikProps.values.phoneNumber
      );
      Alert.alert("Code Sent (Simulated)", "Please use 123456 to verify.");
      setCodeSent(true);
      setStep(2); // Move to step 2
    }
  };

  /**
   * Step 2: Validate the verification code
   */
  const handleVerifyCode = async (formikProps: FormikProps<SignupFormValues>) => {
    formikProps.setFieldTouched('code', true, false);
    await formikProps.validateField('code');

    if (!formikProps.errors.code) {
      console.log('Code verified!');
      setStep(3); // Move to step 3
    }
  };

  /**
   * Step 3: Validate Email
   */
  const handleValidateEmail = async (formikProps: FormikProps<SignupFormValues>) => {
    formikProps.setFieldTouched('email', true, false);
    await formikProps.validateField('email');

    if (!formikProps.errors.email) {
      setStep(4); // Move to step 4
    }
  };

  /**
   * Step 4: Validate First and Last Name
   */
  const handleValidateNames = async (formikProps: FormikProps<SignupFormValues>) => {
    formikProps.setFieldTouched('firstName', true, false);
    formikProps.setFieldTouched('lastName', true, false);
    await Promise.all([
      formikProps.validateField('firstName'),
      formikProps.validateField('lastName'),
    ]);

    if (!formikProps.errors.firstName && !formikProps.errors.lastName) {
      setStep(5); // Move to step 5
    }
  };

  /**
   * Final Step: Handle the actual form submission
   */
  const router = useRouter()

  const handleSignup = (
    values: SignupFormValues,
    { setSubmitting, resetForm }: FormikHelpers<SignupFormValues>
  ) => {
    console.log('Submitting form with values:', values);
    // In a real app, you would make your API call here for the elder-care platform.
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Signup Successful!',
        `Welcome, ${values.firstName}! Your account is created.`,
        [{ text: 'OK', onPress: () => {
            resetForm(); // Reset form fields
            router.push('/(auth)/login')
        }}]
      );
    }, 1000);
  };

  const initialFormValues: SignupFormValues = {
    phoneNumber: '',
    code: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join your family's elder-care circle.
          </Text>

          <Formik
            initialValues={initialFormValues}
            validationSchema={signupValidationSchema}
            onSubmit={handleSignup}
          >
            {(formikProps: FormikProps<SignupFormValues>) => (
              <View>
                {/* --- Step 1: Phone Number --- */}
                {step === 1 && (
                  <>
                    <FormInput
                      formikProps={formikProps}
                      fieldName="phoneNumber"
                      label="Phone Number"
                      keyboardType="phone-pad"
                      placeholder="Enter your phone number"
                    />
                    <FormButton
                      title="Send Verification Code"
                      onPress={() => handleSendCode(formikProps)}
                      disabled={formikProps.isSubmitting}
                    />
                  </>
                )}

                {/* --- Step 2: Verification Code --- */}
                {step === 2 && codeSent && (
                  <>
                    <Text style={styles.infoText}>
                      We "sent" a code to {formikProps.values.phoneNumber}.
                      (Please enter 123456)
                    </Text>
                    <FormInput
                      formikProps={formikProps}
                      fieldName="code"
                      label="Verification Code"
                      keyboardType="number-pad"
                      placeholder="6-digit code"
                      maxLength={6}
                    />
                    <FormButton
                      title="Verify Code"
                      onPress={() => handleVerifyCode(formikProps)}
                      disabled={formikProps.isSubmitting}
                    />
                  </>
                )}

                {/* --- Step 3: Email --- */}
                {step === 3 && (
                  <>
                    <FormInput
                      formikProps={formikProps}
                      fieldName="email"
                      label="Email Address"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="you@example.com"
                    />
                    <FormButton
                      title="Next"
                      onPress={() => handleValidateEmail(formikProps)}
                      disabled={formikProps.isSubmitting}
                    />
                  </>
                )}

                {/* --- Step 4: First & Last Name --- */}
                {step === 4 && (
                  <>
                    <FormInput
                      formikProps={formikProps}
                      fieldName="firstName"
                      label="First Name"
                      autoCapitalize="words"
                    />
                    <FormInput
                      formikProps={formikProps}
                      fieldName="lastName"
                      label="Last Name"
                      autoCapitalize="words"
                    />
                    <FormButton
                      title="Next"
                      onPress={() => handleValidateNames(formikProps)}
                      disabled={formikProps.isSubmitting}
                    />
                  </>
                )}

                {/* --- Step 5: Password --- */}
                {step === 5 && (
                  <>
                    <FormInput
                      formikProps={formikProps}
                      fieldName="password"
                      label="Create Password"
                      secureTextEntry
                      placeholder="Minimum 8 characters"
                    />
                    <FormInput
                      formikProps={formikProps}
                      fieldName="confirmPassword"
                      label="Confirm Password"
                      secureTextEntry
                    />
                    <FormButton
                      title={formikProps.isSubmitting ? 'Signing Up...' : 'Sign Up'}
                      onPress={formikProps.handleSubmit} // This is the final submit
                      disabled={formikProps.isSubmitting}
                    />
                  </>
                )}
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12, // Using paddingVertical for better control on both platforms
    height: 48, // Explicit height for consistency
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 14,
    marginTop: 6,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#a9a9a9',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
});

export default FamilySignUp;


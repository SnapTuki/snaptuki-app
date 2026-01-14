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
  Button,
  Alert, // Using native Alert for mobile
} from 'react-native';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import { useMutation } from '@apollo/client/react';
import { COMPLETE_REGISTERATION, REQUEST_REGISTERATION_OTP, VERIFY_EMAIL } from '@/src/graphql/mutations';
import { UserRole } from '@/src/types/__generated__/graphql';
import { useSession } from '@/src/hooks/useSession';
// --- TypeScript Interfaces ---

/**
 * Defines the shape of the form's values.
 */
interface SignupFormValues {
  code: string;
  email: string;
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
  code: Yup.string()
    .required('Verification code is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),

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

  const [VerifyEmail, { data: verifyEmailData, error: verifyEmailError }] = useMutation(VERIFY_EMAIL);
  const [requestRegisterationOtp, { data: reqRegOtpData, error: reqREgOtpError }] = useMutation(REQUEST_REGISTERATION_OTP);
  const [completeRegisteration, {data: compRegData, error: compRegError}] = useMutation(COMPLETE_REGISTERATION);
  // --- Step Handlers ---



  /**
   * Step 2: Validate Email
   */
  const handleValidateEmail = async (formikProps: FormikProps<SignupFormValues>) => {
    formikProps.setFieldTouched('email', true, false);
    await formikProps.validateField('email');

    if (!formikProps.errors.email) {
      requestRegisterationOtp({ variables: { email: formikProps.values.email } });
      if (reqREgOtpError) {
        console.log("Error happened while requesting OTP")
      } else {
        console.log(reqREgOtpError)
        setCodeSent(true);
        setStep(2); // Move to step 2
      }
    }
  };


  /**
   * Step 3: Validate the verification code
   */
  const handleVerifyCode = async (formikProps: FormikProps<SignupFormValues>) => {
    formikProps.setFieldTouched('code', true, false);
    await formikProps.validateField('code');

    if (!formikProps.errors.code) {

      VerifyEmail({
        variables: {
          data: {
            email: formikProps.values.email,
            otpCode: formikProps.values.code
          }
        }
      })

      if(verifyEmailError){
        console.log(verifyEmailError.message)
        return
      }
      setStep(3); // Move to step 3

    }
  };

  /**
   * Final Step: Handle the actual form submission
   */
  const router = useRouter()

  const handleSignup = (values: SignupFormValues) => {
    console.log('Submitting form with values:', values);
    
    completeRegisteration({
      variables: {
        data:{
          email: values.email,
          password: values.password,
          role: UserRole.Family
        }
      }
    })


    console.log("Registeration Completed");

    if(compRegError){
      Alert.alert('ERROR', 'Account cannot be created');
    }else if(compRegData){
      console.log("Go to loging view")
      router.replace('/(auth)/login');
    }
  };

  const initialFormValues: SignupFormValues = {
    code: '',
    email: '',
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
                {/* --- Step 1: Email --- */}
                {step === 1 && (
                  <>
                    <FormInput
                      formikProps={formikProps}
                      fieldName="email"
                      label="Email Address"
                      keyboardType="email-address"
                      placeholder="Enter your email"
                    />
                    <FormButton
                      title="Send Verification Code"
                      onPress={() => handleValidateEmail(formikProps)}
                      disabled={formikProps.isSubmitting}
                    />
                  </>
                )}

                {/* --- Step 2: Verification Code --- */}
                {step === 2 && codeSent && (
                  <>
                    <Text style={styles.infoText}>
                      We "sent" a code to {formikProps.values.email}.
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


                {/* --- Step 3: Password --- */}
                {step === 3 && (
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


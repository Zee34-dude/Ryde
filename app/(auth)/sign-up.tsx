import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNativeModal } from 'react-native-modal';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import { icons, images } from '@/constants';
import InputField from '@/components/InputField';
import { useState, useRef } from 'react';
import OAuth from '@/components/OAuth';
import { useSignUp } from '@clerk/expo';
import { fetchAPI } from '@/lib/fetch';

const SignUp = () => {
  const { signUp } = useSignUp();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [name, setName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [formError, setFormError] = useState('');

  const [verification, setVerification] = useState<{
    state: 'default' | 'pending' | 'success' | 'failed' | 'error';
    error: string;
    code: string;
  }>({
    state: 'default',
    error: '',
    code: '',
  });

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setFormError('');

    if (!name.trim() || !emailAddress.trim() || !password.trim()) {
      setFormError('Name, email and password are all required.');
      Alert.alert('Incomplete Form', 'Please fill in all fields before proceeding.');
      return;
    }

    setIsLoading(true);
    try {
      if (!signUp) {
        throw new Error('Authentication service unavailable. Please check your connection.');
      }

      await signUp.password({
        emailAddress,
        password,
      });

      await signUp.verifications.sendEmailCode();
      setVerification({ ...verification, state: 'pending' });
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.message || err.message || 'An error occurred during registration.';
      setFormError(errorMessage);
      Alert.alert('Sign Up Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!signUp) return;
    setVerifying(true);
    try {
      await signUp.verifications.verifyEmailCode({
        code: verification.code,
      });

      if (signUp.status === 'complete') {
        await fetchAPI('/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email: emailAddress,
            clerkId: signUp.id,
          }),
        });
        await signUp.finalize();
        setVerification({ ...verification, state: 'success' });
      } else {
        setVerification({
          ...verification,
          state: 'failed',
          error: 'Verification was not completed successfully.',
        });
      }
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.message || 'The code you entered is invalid. Please try again.';
      setVerification({ ...verification, state: 'error', error: errorMessage });
    } finally {
      setVerifying(false);
    }
  };

  const handlePasswordFocus = () => {
    // Scroll the view up so the password field is clearly visible
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 160, animated: true });
    }, 200);
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 pb-10">
            <View className="relative w-full h-[250px]">
              <Image source={images.signUpCar} className="z-0 w-full h-full opacity-60" />
              <LinearGradient
                colors={['transparent', 'rgba(15, 23, 42, 0.8)', '#0F172A']}
                className="absolute inset-0 z-10"
              />
              <View className="absolute bottom-10 left-0 right-0 p-8 z-20">
                <Text className="text-4xl font-JakartaExtraBold text-white">Create Account</Text>
                <Text className="text-md font-JakartaMedium text-secondary-300 mt-2">
                  Start your journey with dryVe
                </Text>
              </View>
            </View>

            <View className="px-6 -mt-10 z-30">
              <InputField
                label="Name"
                placeholder="Enter your name"
                icon={icons.person}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setFormError('');
                }}
              />
              <InputField
                label="Email"
                placeholder="Enter your email"
                icon={icons.email}
                value={emailAddress}
                onChangeText={(text) => {
                  setEmailAddress(text);
                  setFormError('');
                }}
              />
              <InputField
                label="Password"
                placeholder="Enter your password"
                icon={icons.lock}
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setFormError('');
                }}
                onFocus={handlePasswordFocus}
              />

              {formError ? (
                <Text className="text-red-500 text-sm mt-1 mb-2 font-JakartaMedium">
                  {formError}
                </Text>
              ) : null}

              <CustomButton
                title="Sign Up"
                onPress={handleSubmit}
                loading={isLoading}
                className="mt-6 shadow-indigo-500/30"
              />

              <OAuth />

              <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')} className="mt-4">
                <Text className="text-secondary-400 font-JakartaSemiBold text-center">
                  Already have an account?{' '}
                  <Text className="text-primary-500 font-JakartaBold">Log In</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <ReactNativeModal
              isVisible={verification.state === 'pending' || verification.state === 'success'}
              onBackdropPress={() => {
                if (verification.state === 'pending') {
                  setVerification({ ...verification, state: 'default' });
                }
              }}
              animationIn="fadeInUp"
              animationOut="fadeOutDown"
            >
              <View className="bg-secondary-800 px-7 py-9 rounded-3xl border border-secondary-700 min-h-[300px]">
                {verification.state === 'pending' ? (
                  <>
                    <TouchableOpacity
                      onPress={() => setVerification({ ...verification, state: 'default' })}
                      className="bg-secondary-700 w-10 h-10 rounded-full flex items-center justify-center mb-5"
                    >
                      <Image
                        source={icons.backArrow}
                        className="w-5 h-5"
                        style={{ tintColor: '#fff' }}
                      />
                    </TouchableOpacity>

                    <Text className="font-JakartaExtraBold text-2xl mb-2 text-white">
                      Verification
                    </Text>
                    <Text className="font-JakartaMedium text-secondary-400 mb-5">
                      We sent a code to {emailAddress}. Enter it below to verify your account.
                    </Text>
                    <InputField
                      label={'One-Time Password'}
                      icon={icons.lock}
                      placeholder={'12345'}
                      value={verification.code}
                      keyboardType="numeric"
                      labelStyle="text-white"
                      onChangeText={(code) => setVerification({ ...verification, code })}
                    />
                    {verification.error && (
                      <Text className="text-red-500 text-sm mt-1">{verification.error}</Text>
                    )}
                    <CustomButton
                      title="Verify Email"
                      onPress={handleVerify}
                      className="mt-8 bg-success-500 shadow-success-500/20"
                      loading={verifying}
                    />
                  </>
                ) : (
                  <View className="flex items-center justify-center">
                    <View className="w-24 h-24 bg-success-500/20 rounded-full flex items-center justify-center mb-5">
                      <Image source={images.check} className="w-14 h-14" />
                    </View>
                    <Text className="text-3xl font-JakartaExtraBold text-center text-white">
                      Verified
                    </Text>
                    <Text className="text-base text-secondary-400 font-JakartaMedium text-center mt-3">
                      Your account has been successfully verified! You&apos;re ready to start using
                      dryVe.
                    </Text>
                    <CustomButton
                      title="Browse Home"
                      onPress={() => {
                        setVerification({ ...verification, state: 'default' });
                        router.push('/(root)/(tabs)/home' as any);
                      }}
                      className="mt-8 shadow-indigo-500/30"
                    />
                  </View>
                )}
              </View>
            </ReactNativeModal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;

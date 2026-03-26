import { ScrollView, Text, TouchableOpacity, View, Image, StyleSheet, Alert } from 'react-native';
import { ReactNativeModal } from 'react-native-modal';
import { Href, useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { icons, images } from '@/constants';
import InputField from '@/components/InputField';
import { useState } from 'react';
import OAuth from '@/components/OAuth';
import { useSignUp, useAuth } from '@clerk/expo';

const SignUp = () => {
  const { signUp } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verification, setVerification] = useState({
    state: 'default',
    error: '',
    code: '',
  });

  const handleSubmit = async () => {
    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      await signUp.verifications.sendEmailCode();
      setVerification({ ...verification, state: 'pending' });
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.errors[0].message);
    }
  };

  const handleVerify = async () => {
    try {
      await signUp.verifications.verifyEmailCode({
        code: verification.code,
      });
      if (signUp.status === 'complete') {
        //TODO: Create a database user!
        await signUp.finalize({
          // Redirect the user to the home page after signing up
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              // Handle pending session tasks
              // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
              console.log(session?.currentTask);
              return;
            }

            const url = decorateUrl('/');
            if (url.startsWith('http')) {
              window.location.href = url;
            } else {
              router.push(url as Href);
            }
          },
        });
        setVerification({ ...verification, state: 'success' });
      } else {
        setVerification({ ...verification, state: 'failed', error: 'Sign-up not complete' });
      }
    } catch (err: any) {
      setVerification({ ...verification, state: 'error', error: err.errors[0].message });
    }
  };

  if (signUp.status === 'complete' || isSignedIn) {
    return null;
  }

  // if (
  //   signUp.status === 'missing_requirements' &&
  //   signUp.unverifiedFields.includes('email_address') &&
  //   signUp.missingFields.length === 0
  // ) {
  //   return (
  //     <ThemedView style={styles.container}>
  //       <ThemedText type="title" style={styles.title}>
  //         Verify your account
  //       </ThemedText>
  //       <TextInput
  //         style={styles.input}
  //         value={code}
  //         placeholder="Enter your verification code"
  //         placeholderTextColor="#666666"
  //         onChangeText={(code) => setCode(code)}
  //         keyboardType="numeric"
  //       />
  //       {errors.fields.code && (
  //         <ThemedText style={styles.error}>{errors.fields.code.message}</ThemedText>
  //       )}
  //       <Pressable
  //         style={({ pressed }) => [
  //           styles.button,
  //           fetchStatus === 'fetching' && styles.buttonDisabled,
  //           pressed && styles.buttonPressed,
  //         ]}
  //         onPress={handleVerify}
  //         disabled={fetchStatus === 'fetching'}
  //       >
  //         <ThemedText style={styles.buttonText}>Verify</ThemedText>
  //       </Pressable>
  //       <Pressable
  //         style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
  //         onPress={() => signUp.verifications.sendEmailCode()}
  //       >
  //         <ThemedText style={styles.secondaryButtonText}>I need a new code</ThemedText>
  //       </Pressable>
  //     </ThemedView>
  //   )
  // }
  return (
    <ScrollView className="flex-1 h-full bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl font-JakartaSemiBold text-center absolute bottom-5 left-5">
            {' '}
            Sign Up with Ryde
          </Text>
          <Text className="text-md font-JakartaMedium text-gray-400 text-center mt-2 px-10">
            Join us and get a comfortable ride to your destination!
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={emailAddress}
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <CustomButton title="Sign Up" onPress={handleSubmit} />
          {/* OAuth */}
          <OAuth />
          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')} className="mt-5">
            <Text className="text-general-200 font-JakartaSemiBold text-center ">
              Already have an account? <Text className="text-primary-500">Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>
        <ReactNativeModal
          isVisible={verification.state === 'pending'}
          // onBackdropPress={() =>
          //   setVerification({ ...verification, state: "default" })
          // }
          onModalHide={() => {
            if (verification.state === 'success') {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">Verification</Text>
            <Text className="font-Jakarta mb-5">
              We&apos;ve sent a verification code to {emailAddress}.
            </Text>
            <InputField
              label={'Code'}
              icon={icons.lock}
              placeholder={'12345'}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) => setVerification({ ...verification, code })}
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">{verification.error}</Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={handleVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={verification.state === 'success'}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5" />
            <Text className="text-3xl font-JakartaBold text-center">Verified</Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => router.push(`/(root)/(tabs)/home`)}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;

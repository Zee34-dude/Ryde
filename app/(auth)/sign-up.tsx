import { ScrollView, Text, TouchableOpacity, View, Image, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verification, setVerification] = useState({
    state: 'default',
    error: '',
    code: '',
  });

  const handleSubmit = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
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
    } finally {
      setVerifying(false);
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
    <ScrollView className="flex-1 bg-secondary-900">
      <View className="flex-1 bg-secondary-900 pb-10">
        <View className="relative w-full h-[300px]">
          <Image source={images.signUpCar} className="z-0 w-full h-full opacity-60" />
          <LinearGradient
            colors={['transparent', 'rgba(15, 23, 42, 0.8)', '#0F172A']}
            className="absolute inset-0 z-10"
          />
          <View className="absolute bottom-10 left-0 right-0 p-8 z-20">
            <Text className="text-4xl font-JakartaExtraBold text-white">Create Account</Text>
            <Text className="text-md font-JakartaMedium text-secondary-300 mt-2">
              Start your journey with Ryde
            </Text>
          </View>
        </View>

        <View className="px-6 -mt-10 z-30">
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
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <CustomButton 
            title="Sign Up" 
            onPress={handleSubmit} 
            loading={isLoading} 
            className="mt-4 shadow-indigo-500/30" 
          />
          
          <OAuth />
          
          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')} className="mt-4">
            <Text className="text-secondary-400 font-JakartaSemiBold text-center">
              Already have an account? <Text className="text-primary-500 font-JakartaBold">Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <ReactNativeModal
          isVisible={verification.state === 'pending' || verification.state === 'success'}
          onBackdropPress={() => setVerification({ ...verification, state: 'default' })}
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
                  <Image source={icons.backArrow} className="w-5 h-5" style={{ tintColor: '#fff' }} />
                </TouchableOpacity>

                <Text className="font-JakartaExtraBold text-2xl mb-2 text-white">Verification</Text>
                <Text className="font-JakartaMedium text-secondary-400 mb-5">
                  We&apos;ve sent a verification code to {emailAddress}.
                </Text>
                <InputField
                  label={'Code'}
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
                <Text className="text-3xl font-JakartaExtraBold text-center text-white">Verified</Text>
                <Text className="text-base text-secondary-400 font-JakartaMedium text-center mt-3">
                  You have successfully verified your account.
                </Text>
                <CustomButton
                  title="Browse Home"
                  onPress={() => router.push(`/(root)/(tabs)/home`)}
                  className="mt-8 shadow-indigo-500/30"
                />
              </View>
            )}
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;

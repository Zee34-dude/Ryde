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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import { icons, images } from '@/constants';
import InputField from '@/components/InputField';
import { useState, useRef } from 'react';
import OAuth from '@/components/OAuth';
import { useClerk, useSignIn } from '@clerk/expo';

const SignIn = () => {
  const { signIn } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const onSignInPress = async () => {


    Keyboard.dismiss();
    setFormError('');

    if (!emailAddress.trim() || !password.trim()) {
      setFormError('Email and password are required.');
      Alert.alert('Incomplete Form', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn.password({
        identifier: emailAddress,
        password,
      });
      if(result.error){
        console.log(result.error);
      }
      await setActive({ session: signIn.createdSessionId });

      if (signIn.status === 'complete') {
        router.replace('/(root)/(tabs)/home');
      } else {
        setFormError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.message || 'An error occurred during sign in.';
      setFormError(errorMessage);
      Alert.alert('Sign In Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 150, animated: true });
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
            <View className="relative w-full h-[300px]">
              <Image source={images.signUpCar} className="z-0 w-full h-full opacity-60" />
              <LinearGradient
                colors={['transparent', 'rgba(15, 23, 42, 0.8)', '#0F172A']}
                className="absolute inset-0 z-10"
              />
              <View className="absolute bottom-10 left-0 right-0 p-8 z-20">
                <Text className="text-4xl font-JakartaExtraBold text-white">Welcome Back</Text>
                <Text className="text-md font-JakartaMedium text-secondary-300 mt-2">
                  Log in to your dryVe account
                </Text>
              </View>
            </View>

            <View className="px-6 -mt-10 z-30">
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
                title="Log In"
                onPress={onSignInPress}
                loading={isLoading}
                className="mt-6 shadow-indigo-500/30"
              />

              <OAuth />

              <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')} className="mt-4">
                <Text className="text-secondary-400 font-JakartaSemiBold text-center">
                  Don&apos;t have an account?{' '}
                  <Text className="text-primary-500 font-JakartaBold">Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;

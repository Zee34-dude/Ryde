import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { icons, images } from '@/constants';
import InputField from '@/components/InputField';
import { useState } from 'react';
import OAuth from '@/components/OAuth';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const onSignInPress = async () => { };
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
            <Text className="text-4xl font-JakartaExtraBold text-white">Welcome back</Text>
            <Text className="text-md font-JakartaMedium text-secondary-300 mt-2">
              Sign in to your account
            </Text>
          </View>
        </View>

        <View className="px-6 -mt-10 z-30">
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />
          <CustomButton title="Sign In" onPress={onSignInPress} className="mt-8 shadow-indigo-500/30" />
          
          <OAuth />
          
          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')} className="mt-8">
            <Text className="text-secondary-400 font-JakartaSemiBold text-center">
              Don&apos;t have an account? <Text className="text-primary-500 font-JakartaBold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;

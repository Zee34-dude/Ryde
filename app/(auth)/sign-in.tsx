import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';

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
  const onSignInPress = async () => {};
  return (
    <ScrollView className="flex-1 h-full bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl font-JakartaSemiBold text-center absolute bottom-5 left-5">
            {' '}
            Sign In to Ryde
          </Text>
        </View>

        <View className="p-5">
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
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />
          <CustomButton title="Sign Up" onPress={onSignInPress} />
          {/* OAuth */}
          <OAuth />
          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')} className="mt-10">
            <Text className="text-general-200 font-JakartaSemiBold text-center ">
              Don&apos;t have an account? <Text className="text-primary-500">Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;

import { Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';

const SignUp = () => {
  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white px-5">
      <View className="flex-1 items-center justify-center w-full">
        <Image source={require('@/assets/images/signup-car.png')} className="w-full h-1/3" resizeMode="contain" />
        <Text className="text-2xl font-bold font-JakartaBold text-center mt-5">Sign Up with Ryde</Text>
        <Text className="text-md font-JakartaMedium text-gray-400 text-center mt-2 px-10">
          Join us and get a comfortable ride to your destination!
        </Text>

        <View className="w-full mt-10">
          <CustomButton title="Get Started" onPress={() => router.replace('/(auth)/sign-in')} className="mt-5" />
        </View>
      </View>

      <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')} className="mb-10">
        <Text className="text-general-200 font-JakartaSemiBold">
          Already have an account? <Text className="text-primary-500">Log In</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignUp;

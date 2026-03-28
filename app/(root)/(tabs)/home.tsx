import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/expo';

export default function Home() {
  const { user } = useUser();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-5">
        <Text className="text-2xl font-JakartaBold">Home</Text>
        <Text className="text-md font-JakartaRegular mt-2">Welcome to Dryve!</Text>
        <Text className="text-md font-JakartaRegular mt-2">
          {user?.emailAddresses[0].emailAddress}
        </Text>
      </View>
    </SafeAreaView>
  );
}

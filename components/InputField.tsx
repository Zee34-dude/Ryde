import { InputFieldProps } from '@/types/type';

import {
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Image,
  Platform,
} from 'react-native';

const InputField = ({
  label,
  labelStyle,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>{label}</Text>
          <View
            className={`w-full flex flex-row items-center justify-start rounded-full border border-neutral-100 focus:border-primary-500 ${containerStyle}`}
          >
            {icon && <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />}
            <TextInput
              className={`flex-1 ml-2 text-left p-4 font-JakartaSemiBold rounded-full ${inputStyle}`}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;

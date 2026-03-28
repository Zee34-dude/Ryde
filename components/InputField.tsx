import { InputFieldProps } from '@/types/type';
import { TextInput, View, Text, Image } from 'react-native';

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
    <View className="my-2 w-full">
      <Text className={`text-lg text-white font-JakartaSemiBold mb-3 ${labelStyle}`}>{label}</Text>
      <View
        className={`w-full flex flex-row items-center justify-start rounded-full border border-neutral-100 focus:border-primary-500 ${containerStyle}`}
      >
        {icon && <Image source={icon} className={`w-6 h-6 ml-4 opacity-50 ${iconStyle}`} />}
        <TextInput
          placeholderTextColor="#94A3B8"
          className={`flex-1 ml-2 text-left p-4 font-JakartaSemiBold text-[#94A3B8] ${inputStyle}`}
          secureTextEntry={secureTextEntry}
          {...props}
        />
      </View>
    </View>
  );
};

export default InputField;

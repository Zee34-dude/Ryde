import { ButtonProps } from '@/types/type';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const getBgVariantStyle = (variant: ButtonProps['bgVariant']) => {
  switch (variant) {
    case 'secondary':
      return 'bg-primary-500';
    case 'danger':
      return 'bg-red-500';
    case 'success':
      return 'bg-green-500';
    case 'outline':
      return 'bg-transparent border-neutral-300 border-[0.5px]';
    default:
      return 'bg-[#0286FF]';
  }
};

const getTextVariantStyle = (variant: ButtonProps['textVariant']) => {
  switch (variant) {
    case 'primary':
      return 'text-black';
    case 'secondary':
      return 'bg-primary-500';
    case 'danger':
      return 'text-red-100';
    case 'success':
      return 'text-green-100';

    default:
      return 'text-white';
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = 'secondary',
  textVariant = 'default',
  IconLeft,
  IconRight,
  className,
  loading = false,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
      className={`w-full rounded-full p-4 flex flex-row justify-center items-center shadow-lg shadow-primary-500/30 ${getBgVariantStyle(bgVariant)} ${className} ${loading ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <>
          {IconLeft && <IconLeft />}
          <Text
            className={`text-lg font-bold ${getTextVariantStyle(textVariant)} font-JakartaBold`}
          >
            {title}
          </Text>
          {IconRight && <IconRight />}
        </>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

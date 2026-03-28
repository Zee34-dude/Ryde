import { Text } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
import { cssInterop } from 'nativewind';

cssInterop(MapView, {
  className: {
    target: 'style',
  },
});

const Map = () => {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      style={{ flex: 1 }}
      tintColor="black"
      showsPointsOfInterest={false}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      <Text>Map</Text>
    </MapView>
  );
};

export default Map;

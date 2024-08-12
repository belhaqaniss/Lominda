import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';


const LocationScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locations, setLocations] = useState([
    { id: 1, latitude: 37.7749, longitude: -122.4194 },
    { id: 2, latitude: 34.0522, longitude: -118.2437 },
    { id: 3, latitude: 47.6062, longitude: -122.3321 },
  ]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();

    return () => {
      // Clean up any location subscriptions or tasks if needed
    };
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      setCurrentLocation({ latitude, longitude });
    } catch (error) {
      console.log('Error getting current location:', error);
    }
  };

  const handleRecenter = () => {
    if (currentLocation) {
      const { latitude, longitude } = currentLocation;
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const mapRef = React.createRef();

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: currentLocation ? currentLocation.latitude : 0,
          longitude: currentLocation ? currentLocation.longitude : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
          >
            <Image
              source={require('../assets/favicon.png')}
              style={styles.customMarker}
            />
          </Marker>
        )}

        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={`Location ${location.id}`}
          >
            <Image
              source={require('../assets/favicon.png')}
              style={styles.customMarker}
            />
          </Marker>
        ))}
      </MapView>
      {currentLocation && (
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/favicon.png')}
            style={styles.logo}
          />
        </View>
      )}
      <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
        <MaterialIcons name="my-location" size={24} color="#ff5252" />

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.05,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  recenterButtonText: {
    color: 'white',
    fontSize: 16,
  },
  customMarker: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default LocationScreen;

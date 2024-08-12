import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const AddScreen = () => {
  const navigation = useNavigation();
  const ref = useRef();
  const [currentStep, setCurrentStep] = useState(1);
  const slideAnimation = useState(new Animated.Value(0))[0];
  const [textFieldValue, setTextFieldValue] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    ref.current?.setAddressText('Some Text');
  }, []);

  const loadData = async () => {
    try {
      const storedTextFieldValue = await AsyncStorage.getItem('textFieldValue');
      const storedLocation = await AsyncStorage.getItem('location');
      const storedLatitude = await AsyncStorage.getItem('latitude');
      const storedLongitude = await AsyncStorage.getItem('longitude');
      const storedLocationName = await AsyncStorage.getItem('locationName');
      if (storedTextFieldValue) {
        setTextFieldValue(storedTextFieldValue);
      }
      if (storedLocation) {
        setLocation(storedLocation);
      }
      if (storedLatitude) {
        setLatitude(storedLatitude);
      }
      if (storedLongitude) {
        setLongitude(storedLongitude);
      }
      if (storedLocationName) {
        setLocationName(storedLocationName);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('textFieldValue', textFieldValue);
      await AsyncStorage.setItem('location', location);
      await AsyncStorage.setItem('latitude', latitude);
      await AsyncStorage.setItem('longitude', longitude);
      await AsyncStorage.setItem('locationName', locationName);
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  const handleNext = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('items');
      let items = [];
      if (storedItems) {
        items = JSON.parse(storedItems);
      }
      const newItem = {
        id: Date.now(),
        text: textFieldValue,
        latitude: latitude,
        longitude: longitude,
        locationName: locationName,
        checked: false,
      };
      items.push(newItem);
      await AsyncStorage.setItem('items', JSON.stringify(items));
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
    } catch (error) {
      console.log('Error saving data:', error);
    }
  
    Animated.timing(slideAnimation, {
      toValue: -1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(currentStep + 1);
      slideAnimation.setValue(0);
      setTextFieldValue('');
      setLocation('');
      setLatitude('');
      setLongitude('');
      setLocationName('');
    });
  };
  

  const handleBack = () => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(currentStep - 1);
      slideAnimation.setValue(0);
    });
  };

  const getAnimatedStyle = () => {
    const slideValue = slideAnimation.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [100, 0, -100],
    });
    return {
      transform: [{ translateX: slideValue }],
    };
  };

  const navigateToTabBar = () => {
    saveData();
    navigation.navigate('TabBar');
  };

  const renderStepContent = () => {
    const stepTexts = ['Name of the reminder', 'Add Location'];

    if (currentStep === 1) {
      return (
        <Animated.View style={[styles.stepContainer, getAnimatedStyle()]}>
          <Text style={styles.stepText}>{stepTexts[currentStep - 1]}</Text>
          <TextInput
            style={styles.textField}
            placeholder="Enter up to 50 characters"
            maxLength={50}
            value={textFieldValue}
            onChangeText={setTextFieldValue}
          />

          <TouchableOpacity
            style={[
              styles.button,
              textFieldValue.length === 0 ? styles.inactiveButton : null,
            ]}
            onPress={handleNext}
            disabled={textFieldValue.length === 0}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    return (
      <Animated.View style={[styles.stepContainer, getAnimatedStyle()]}>
        <Text style={styles.stepText}>{stepTexts[currentStep - 1]}</Text>
        <View style={styles.searchContainer}>
          <GooglePlacesAutocomplete
            placeholder="Search for a place"
            onPress={(data, details = null) => {
              setLocation(data.description);
              if (details && details.geometry && details.geometry.location) {
                setLatitude(details.geometry.location.lat);
                setLongitude(details.geometry.location.lng);
                setLocationName(data.structured_formatting.main_text);
              } else {
                setLatitude('');
                setLongitude('');
                setLocationName('');
              }
            }}            
            query={{
              key: 'AIzaSyCYaqlFSryyKWFqxNnpJUdNp2xXBBWwGzk', // Replace with your Google Places API key
              language: 'en',
            }}
            styles={{
              textInputContainer: styles.searchInputContainer,
              textInput: styles.searchInput,
              container: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
              },
              listView: styles.listView,
              row: styles.row,
              poweredContainer: styles.poweredContainer,
              separator: styles.separator,
              description: styles.description,
            }}
            renderRow={(rowData) => <RowItem data={rowData} />}
          />

        </View>

        <TouchableOpacity style={styles.button} onPress={navigateToTabBar}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const RowItem = ({ data }) => (
    <View style={styles.rowItem}>
      <Text style={styles.rowText}>{data.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>{renderStepContent()}</View>
      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  stepContainer: {
    alignItems: 'center',
    width: '100%',
  },
  stepText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textField: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchContainer: {
    width: '100%',
    marginBottom: 16,
    position: 'relative',
  },
  searchInputContainer: {
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 8,
    height: 40,
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 10,
  },
  listView: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
  },
  row: {
    padding: 10,
  },
  rowText: {
    fontSize: 16,
  },
  poweredContainer: {
    display: 'none',
  },
  separator: {
    height: 0,
  },
  description: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ff5252',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  inactiveButton: {
    opacity: 0.5,
  },
});

export default AddScreen;

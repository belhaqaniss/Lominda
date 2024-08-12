// Import required modules
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your custom components for each page
import TabBar from './Pages/TabBar';
import AddScreen from './Pages/AddScreen';

// Create a stack navigator
const Stack = createStackNavigator();

// Main component
function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TabBar"
        screenOptions={{
          headerShown: false, // Set headerShown to false to hide the header
        }}
      >
        <Stack.Screen name="TabBar" component={TabBar} />
        <Stack.Screen name="AddScreen" component={AddScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Main;

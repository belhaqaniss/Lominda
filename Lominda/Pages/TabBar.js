import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Home from "./Home";
import LocationScreen from "./LocationScreen";

const Tab = createBottomTabNavigator();

const TabBar = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Location") {
              iconName = focused ? "location" : "location-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#ff5252",
          tabBarInactiveTintColor: "#000000",
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
          },
          tabBarItemStyle: {
            paddingVertical: 0,
          },
          tabBarStyle: {
            backgroundColor: "#ffffff",
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Location" component={LocationScreen} />
      </Tab.Navigator>
  );
};

export default TabBar;

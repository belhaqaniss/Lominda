import React, { useEffect } from "react";
import { View, Image } from "react-native";

const SplashScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to the main screen or any other screen in your app
      // Example: navigation.navigate('MainScreen');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ff5252",
      }}
    >
      {/* Add your splash screen image or any other content */}
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

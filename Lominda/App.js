import React, { useState, useEffect } from "react";
import { View } from "react-native";
import SplashScreen from "./Components/splashScreen";
import Main from "./Main";

const App = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Perform any app initialization tasks here

    // Example: Simulate a 2-second delay for app initialization
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 2000);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  if (!appReady) {
    return <SplashScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Main />
    </View>
  );
};

export default App;

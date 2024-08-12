import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  FlatList,
  Animated,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";

const Main = () => {
  const navigation = useNavigation();

  const [items, setItems] = useState([]);
  const [locationName, setLocationName] = useState(""); // State for locationName

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("items");
      const storedLocationName = await AsyncStorage.getItem("locationName"); // Retrieve locationName

      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
      if (storedLocationName) {
        setLocationName(storedLocationName); // Set locationName in state
      }
    } catch (error) {
      console.log("Error loading data:", error);
    }
  };

  const saveData = async (updatedItems) => {
    try {
      await AsyncStorage.setItem("items", JSON.stringify(updatedItems));
    } catch (error) {
      console.log("Error saving data:", error);
    }
  };

  const deleteItem = async (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    saveData(updatedItems);
  };

  const toggleItem = (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    saveData(updatedItems);
  };

  const renderItem = ({ item }) => {
    const rightSwipeActions = (progress, dragX) => {
      const trans = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: "clamp",
      });
      return (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteItem(item.id)}
        >
          <Animated.Text style={[styles.deleteButtonText, { opacity: trans }]}>
            Delete
          </Animated.Text>
        </TouchableOpacity>
      );
    };

    return (
      <Swipeable
        renderRightActions={rightSwipeActions}
        onSwipeableRightOpen={() => deleteItem(item.id)}
      >
        <TouchableOpacity
          style={styles.item}
          onPress={() => toggleItem(item.id)}
        >
          <View style={styles.itemContainer}>
            {/* Your existing code */}
            <Text
              style={[
                styles.itemText,
                item.checked ? styles.checkedItemText : null,
              ]}
            >
              {item.text}, {item.locationName} {/* Display item.locationName */}
            </Text>
          </View>
          <View>
            <Text style={styles.checkButton}>test</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const navigateToAddScreen = () => {
    navigation.navigate("AddScreen");
  };

  // Refresh the screen when it gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={styles.addButton} onPress={navigateToAddScreen}>
        <Text style={styles.addButtonText}>Add a reminder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F0F0",
  },
  listContent: {
    paddingTop: 15,
    paddingBottom: 30,
  },
  item: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: "#A0A0A0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkButton: {
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
    padding: 8,
  },
  itemText: {
    fontSize: 16,
    color: "#333333",
  },
  checkedItemText: {
    textDecorationLine: "line-through",
    color: "#808080",
  },
  addButton: {
    backgroundColor: "#ff5252",
    borderRadius: 15,
    marginTop: 15,
    paddingVertical: 15,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff5252",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Main;

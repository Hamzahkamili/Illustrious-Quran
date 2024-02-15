import React from "react";
import { View, StyleSheet, Text } from "react-native";

const Planner = () => {
  return (
    <View style={styles.center}>
      <Text>This is the Planner screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default Planner;
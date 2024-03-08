
import { StyleSheet } from "react-native";
import VersesSlides from "./components/versesSlides";
import Planner from "./screens/Planner"; // Import both screens
import Library from "./screens/library";

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import DrawerSlide from "./components/drawer";
import Slides from "./components/slides";

const Stack = createStackNavigator();
 function New ()  {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Planner" component={Planner} />
        <Stack.Screen name="Library" component={Library} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default function App() {
  return (
    


    <NavigationContainer>
      <Slides />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#90EE90",
    alignItems: "center",
    justifyContent: "center",
  },
});

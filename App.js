
import { StyleSheet } from "react-native";
// import VersesSlides from "./components/versesSlides";
import Home from "./screens/homeScreen";
import Planner from "./screens/Planner"; // Import both screens
import Verses from "./screens/verses";
import Profile from "./screens/profile";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DrawerSlide from "./components/drawer";

// import Slides from "./components/slides";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function BottomTabSlide() {
  return (
      <BottomTab.Navigator
      initialRouteName="Illustrious Quran"
      screenOptions={{
        headerStyle: { backgroundColor: 'ADD8E6' },
        headerShown: false,
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'gray',
        
        tabBarStyle: {
            // position: 'absolute',
            backgroundColor: '#ADD8E6',
            // borderRadius: 50,
            // bottom: 20,
            // marginHorizontal: 16
        }
      }}
    >
      <BottomTab.Screen name="Home" component={Home} options={{ headerShown: true }}/>
      <BottomTab.Screen name="Planner" component={Planner} options={{ headerShown: true }}/>
      {/* <BottomTab.Screen name="Library" component={Library} options={{}} /> */}
      <BottomTab.Screen name="Profile" component={Profile} options={{ headerShown: true }}/>
    </BottomTab.Navigator>
  )
}


export default function App() {
  return (
    <NavigationContainer>
      {/* <Slides /> */}
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={BottomTabSlide} options={{ headerShown: false }}/>
        {/* <Stack.Screen name="Planner" component={Planner} /> */}
        <Stack.Screen name="Verses" component={Verses} options={{title: 'Verses'}}/>
        {/* <Stack.Screen name="Profile" component={Profile} /> */}
      </Stack.Navigator>
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

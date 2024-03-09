import { StyleSheet } from "react-native";
// import VersesSlides from "./components/versesSlides";
import Home from "./screens/homeScreen";
import Planner from "./screens/Planner"; // Import both screens
import Verses from "./screens/verses";
import Profile from "./screens/profile";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import HomeScreen from "./screens/homeScreen";

// import Slides from "./components/slides";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function BottomTabSlide() {
  return (
    <BottomTab.Navigator
    
      initialRouteName="Illustrious Quran"
      screenOptions={{
        headerStyle: { backgroundColor: "#795547" },
        headerShown: false,
        tabBarActiveTintColor: "brown",
        tabBarInactiveTintColor: "#fceddc",

        tabBarStyle: {
          // position: 'absolute',
          backgroundColor: "#795547",
          // borderRadius: 50,
          // bottom: 20,
          // marginHorizontal: 16
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ size }) => (
            <Ionicons name="home" size={size} color="#fceddc" />
          ),
        }}
      />

      <BottomTab.Screen
        name="Planner"
        component={Planner}
        options={{
          headerShown: true,
          title: "Planner",
          tabBarLabel: "Planner",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color="#fceddc" />
          ),
        }}
      />
      {/* <BottomTab.Screen name="Library" component={Library} options={{}} /> */}
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="happy" size={size} color="#fceddc" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer >
      {/* <Slides /> */}
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={BottomTabSlide}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="Planner" component={Planner} /> */}
        <Stack.Screen
          name="Verses"
          component={Verses}
          options={{ title: "Verses" }}
        />
        {/* <Stack.Screen name="Profile" component={Profile} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "e7ded0",
    alignItems: "center",
    justifyContent: "center",
  },
});

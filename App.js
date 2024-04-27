import { StyleSheet } from "react-native";
import Home from "./screens/homeScreen";
import Bookmark from "./screens/Bookmark"; // Import both screens
import Verses from "./screens/verses";
import Profile from "./screens/profile";
import Settings from "./screens/Settings";
// import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
// import HomeScreen from "./screens/homeScreen";
import {Provider} from 'react-redux';
import {store} from './store/store'


const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();
// function DrawerSlide() {
//   return (
//     <Drawer.Navigator screenOptions={{ headerShown: true }}>
//       <Drawer.Screen name="Illustrious Quran" component={HomeScreen} />
//       <Drawer.Screen name="Planner" component={Planner} />
//       <Drawer.Screen name="Profile" component={Profile} />
//     </Drawer.Navigator>
//   );
// }
function BottomTabSlide() {
  return (
    <BottomTab.Navigator
      initialRouteName="Illustrious Quran"
      screenOptions={{
        headerStyle: { backgroundColor: "#fffaf5" },
        tabBarActiveTintColor: "brown",
        tabBarInactiveTintColor: "#fceddc",
        tabBarStyle: {
          backgroundColor: "#fffaf5",
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          title: "Illustrious Quran",
          headerTitleStyle: { color: "#795547" },
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: '#795547' },
          tabBarIcon: ({ size }) => (
            <Ionicons name="home" size={size} color="#795547" />
          ),
        }}
      />

      <BottomTab.Screen
        name="Bookmark"
        component={Bookmark}
        options={{
          headerShown: true,
          title: "Bookmark",
          headerTitleStyle: { color: "#795547" },
          tabBarLabel: "Bookmark",
          tabBarLabelStyle: { color: '#795547' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color="#795547" />
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
          headerTitleStyle: { color: "#795547" },
          tabBarLabel: "Profile",
          tabBarLabelStyle: { color: '#795547' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="happy" size={size} color="#795547" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
          title: "Settings",
          headerTitleStyle: { color: "#795547" },
          tabBarLabel: "Settings",
          tabBarLabelStyle: { color: '#795547' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color="#795547" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
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
          options={{ title: "Verses", headerTitleStyle: { color: "#795547"}, headerStyle: { backgroundColor: "#fffaf5" } }}
          // screenOptions={{
          //   headerStyle: { backgroundColor: "#795547" },
          //   headerTintColor: "#fceddc",
          // }}
        />
        {/* <Stack.Screen name="Profile" component={Profile} /> */}
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
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

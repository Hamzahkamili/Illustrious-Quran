import { StyleSheet } from "react-native";
import Home from "./screens/homeScreen";
import Bookmark from "./screens/Bookmark"; // Import both screens
import Verses from "./screens/verses";
import Profile from "./screens/profile";
import Settings from "./screens/Settings";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Provider } from 'react-redux';
import { store } from './store/store';
import PdfViewer from "./screens/PdfViewer";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function BottomTabSlide() {
  return (
    <BottomTab.Navigator
      initialRouteName="Illustrious Quran"
      screenOptions={{
        headerStyle: { backgroundColor: "#8C6A5D", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
        tabBarActiveTintColor: "#EAD196",
        tabBarInactiveTintColor: "#d3d3d3",
        tabBarStyle: {
          backgroundColor: "#8C6A5D",
          borderTopColor: "#333",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          overflow: 'hidden', // Ensures the borderRadius is visible
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 5,
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          title: "illustrious Quran",
          headerTitleStyle: { color: "white", fontStyle: 'italic' },
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="PdfViewer"
        component={PdfViewer}
        options={{
          headerShown: true,
          title: "The Holy Quran",
          headerTitleStyle: {  color: "white", fontStyle: 'italic'  },
          tabBarLabel: "PDF Viewer",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="document-outline" size={size} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          title: "Profile",
          headerTitleStyle: {  color: "white", fontStyle: 'italic'  },
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
          title: "Settings",
          headerTitleStyle: {  color: "white", fontStyle: 'italic'  },
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={BottomTabSlide}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Verses"
            component={Verses}
            options={{
              title: "Verses",
              headerTitleStyle: { color: "#795547" },
              headerStyle: { backgroundColor: "#fffaf5" },
            }}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7ded0",
    alignItems: "center",
    justifyContent: "center",
  },
});

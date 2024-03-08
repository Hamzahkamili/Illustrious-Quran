// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import HomeScreen from "../screens/homeScreen";
// import Planner from "../screens/Planner";
// import Library from "../screens/library";
// import Profile from "../screens/profile";
// import VersesSlides from "./versesSlides";
// const BottomTab = createBottomTabNavigator();
// function BottomTabSlide(){
//     return (
//         <BottomTab.Navigator
//         initialRouteName="Illustrious Quran"
//         screenOptions={{
//           headerStyle: { backgroundColor: 'ADD8E6' },
//           headerShown: false,
//           tabBarActiveTintColor: 'red',
//           tabBarInactiveTintColor: 'gray',
          
//           tabBarStyle: {
//               // position: 'absolute',
//               backgroundColor: '#ADD8E6',
//               // borderRadius: 50,
//               // bottom: 20,
//               // marginHorizontal: 16
//           }
//         }}
//       >
//         <BottomTab.Screen
//           name="Home"
//           component={HomeScreen}
//           options={{}}
//         />
//         <BottomTab.Screen name="Planner" component={Planner} options={{}} />
//         <BottomTab.Screen name="Library" component={Library} options={{}} />
//         <BottomTab.Screen name="Profile" component={Profile} options={{}} />
//       </BottomTab.Navigator>
//     )
// }
// export default BottomTabSlide;
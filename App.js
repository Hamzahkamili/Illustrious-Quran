import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";




import DrawerSlide from "./components/drawer";





export default function App() {
  return (
    


    <NavigationContainer>
      
      <DrawerSlide />
   
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

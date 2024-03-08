import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import VersesSlides from "./components/versesSlides";



import DrawerSlide from "./components/drawer";
import Slides from "./components/slides";





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

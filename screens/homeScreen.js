import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null); // Track selected surah

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((response) => response.json())
      .then((data) => {
        setSurahs(data?.data);
      })
      .catch((error) =>
        console.error("Error fetching Quran surah names:", error)
      );
  }, []);

  const handleSurahPress = (surah) => {
    setSelectedSurah(surah); // Update selected surah state
    navigation.navigate('Verses', { surah });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSurahPress(item)}
          
          >
            <Text style={styles.surahItem}>{`${item.number}. ${item.englishName} - ${item.name}`}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 9,
    backgroundColor: "#fffaf5",
  },
  surahItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#fceddc",
    color: '#795547',
    
  },
 
});

export default HomeScreen;

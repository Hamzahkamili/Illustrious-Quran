import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";

const HomeScreen = () => {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading,setLoading] = useState(false);
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

  useEffect(() => {
    const surahInfo = async () => {
      if (selectedSurah) {
        await fetch(
          `https://api.alquran.cloud/v1/surah/${selectedSurah?.number}`
        )
          .then((response) => response.json())
          .then((data) => {
            setVerses(data.data.ayahs);
            setLoading(false);
            console.log(data?.data?.ayahs);
          })
          .catch((error) =>
            console.error("Error fetching verses for surah:", error)
          );
      }
    };
    surahInfo();
  }, [selectedSurah]);
  // const surahInfo = async () => {
  //   if (selectedSurah) {
  //     await fetch(
  //       `https://api.alquran.cloud/v1/surah/${selectedSurah?.number}`
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setVerses(data.data.ayahs);
  //         console.log(data?.data?.ayahs);
  //       })
  //       .catch((error) =>
  //         console.error("Error fetching verses for surah:", error)
  //       );
  //   }
  // };
  const handleSurahPress = (surah) => {
    setSelectedSurah(surah);
    setLoading(true);
    // surahInfo()
    console.log(`Surah ${surah.number} is pressed`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quran Surah Names</Text>
      
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSurahPress(item)}
            style={styles.surahItem}
          >
            <Text>{`${item.number}. ${item.englishName} - ${item.name}`}</Text>
            
          </Pressable>
        )}
      />

      {(selectedSurah && !loading )&&(
        <View style={styles.verseContainer}>
          <Text style={styles.header}>
            Verses of {selectedSurah.englishName}
          </Text>
          <FlatList
            data={verses}
            keyExtractor={(item) => item.number.toString()}
            renderItem={({ item }) => (
              <Text>{`${item.number}. ${item.text}`}</Text>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  surahItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  verseContainer: {
    marginTop: 20,
  },
});

export default HomeScreen;

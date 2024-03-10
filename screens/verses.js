import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';

const Verses = ({ route }) => {
  const { surah } = route.params;
  const [verses, setVerses] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch surah information
    setLoading(true);
    const fetchSurahInfo = async () => {
      if (surah) {
        await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`)
          .then((response) => response.json())
          .then((data) => {
            setVerses(data.data.ayahs);
          })
          .catch((error) =>
          console.error("Error fetching verses for surah:", error)
          );
        }
    };

    // Fetch English translation
    const fetchEnglishTranslation = async () => {
      setLoading(true);
      await fetch(`https://api.alquran.cloud/v1/quran/en.asad`)
        .then((response) => response.json())
        .then((data) => {
          const surahTranslation = data.data.surahs.find(
            (s) => s.number === surah.number
          );
          setTranslations(surahTranslation?.ayahs);
        })
        .catch((error) =>
        console.error("Error fetching English translation:", error)
        );
    };

    const fetchAudio = async () => {
      setLoading(true);
      await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/ar.abdulbasitmurattal`)
        .then((response) => response.json())
        .then((data) => {
          setAudios(data.data.ayahs);
        })
        .catch((error) =>
        console.error("Error fetching English translation:", error)
        );
    };

    // Call both functions
    fetchSurahInfo();
    fetchEnglishTranslation();
    fetchAudio();
    setLoading(false);

  }, [surah]);

  if (loading || verses.length === 0 || translations.length === 0) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  // if (!verses) {
  //   return (
  //     <View>
  //       <Text>No verses found</Text>
  //     </View>
  //   );
  // }
  // if (!translations) {
  //   return (
  //     <View>
  //       <Text>No translations found</Text>
  //     </View>
  //   );
  // }
  // console.log(verses);
  // console.log(translations);

  async function audioPlayHandler(index) {
    console.log('Audio play');
    const url = audios[index].audio;
    const { sound } = await Audio.Sound.createAsync({uri: url});
    await sound.playAsync();
  }

  return (
    <View  style={styles.background}>
      <View style={styles.headingContainer}>
        <Text>{surah.englishName}</Text>
        <Text>{surah.name}</Text>
      </View>

      {/* Display verses with translations */}
      {verses.length > 0 && (
        <FlatList
          style={styles.verseContainer}
          data={verses}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.verseRow}>
              <Text style={styles.verseText}>{`${index + 1}. ${item.text}`}</Text>
              {translations.length > 0 && (
                <Text style={styles.translationText}>{`${translations[index]?.text}`}</Text>
              )}
              <View style={styles.controlsContainer}>
                <Button
                  onPress={audioPlayHandler.bind(this, index)}
                  title="▶️"
                  color="#841584"
                />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fffaf5',
  },
  headingContainer: {
    backgroundColor: '#FBEDDC',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verseContainer: {
    margin: 15,
    padding: 10,
    paddingVertical: 30,
    borderBottomWidth: 10,
    borderBottomColor: "#fceddc",
  },
  verseRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#fceddc',
  },
  verseText: {
    textAlign: 'right',
    flex: 1,
  },
  translationText: {
    flex: 1,
  },
});

export default Verses;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import Ionicons from "@expo/vector-icons/Ionicons";

const Verses = ({ route }) => {
  const { surah } = route.params;
  // console.log(typeof(Number(surah.chapter)));
  const [verses, setVerses] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [soundObject, setSound] = useState( new Audio.Sound(""));

  useEffect(() => {
    // Fetch surah information
    setLoading(true);
    const fetchSurahInfo = async () => {
      if (surah) {
        await fetch(`https://api.alquran.cloud/v1/surah/${Number(surah.chapter)}`)
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
            (s) => s.number === Number(surah.chapter)
          );
          setTranslations(surahTranslation?.ayahs);
        })
        .catch((error) =>
        console.error("Error fetching English translation:", error)
        );
    };

    const fetchAudio = async () => {
      setLoading(true);
      await fetch(`https://api.alquran.cloud/v1/surah/${surah.chapter}/ar.abdulbasitmurattal`)
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
    // soundObject.loadAsync({uri:""})

  }, [surah]);

  if (loading || verses.length === 0 || translations.length === 0 || audios.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#795547" />
      </View>
    );
  }
  if (!verses) {
    return (
      <View>
        <Text>No verses found</Text>
      </View>
    );
  }
  if (!translations) {
    return (
      <View>
        <Text>No translations found</Text>
      </View>
    );
  }

  // soundObject.loadAsync({uri:"https://cdn.islamic.network/quran/audio/192/ar.abdulbasitmurattal/1.mp3"})

  async function audioLoadHandler(i) {
    await soundObject.loadAsync({uri:audios[i].audio})
    await audioHandler()
    console.log('playing', i);
    // const url = audios[index].audio;
    // await soundObject.loadAsync({uri:url})
    // await audioHandler()
    // soundObject.unloadAsync();
  }
  async function audioStopHandler() {
    setPlaying(false);
    await soundObject.stopAsync();
    await soundObject.unloadAsync();
  }

  async function audioHandler() {
    console.log('Audio play');
    // const url = audios[index].audio;
    // const { sound } = await Audio.Sound.createAsync({uri: url});
    // await sound.playAsync();
    try {
      setPlaying(true);
      await soundObject.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  return (
    <View  style={styles.background}>
      <View style={styles.headingContainer}>
        <Text>{surah.arabicName}</Text>
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
               <View style={styles.controlsContainer}>
                <View>
                  {!playing ? (
                    <Button
                    onPress={audioLoadHandler.bind(this, index)}
                    title="Play"
                    color="#841584"
                    /> ) : (
                      <Button
                      onPress={audioStopHandler}
                      title="Stop"
                      color="#841584"
                      /> )
                    }
                </View>
                <Text>{index + 1}</Text>
              </View>
              <Text style={styles.verseText}>{item.text}</Text>
              {translations.length > 0 && (
                <Text style={styles.translationText}>{`${translations[index]?.text}`}</Text>
              )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    margin: 8,
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
    borderRadius: 5,
    marginVertical: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fceddc',
  },
  verseText: {
    textAlign: 'right',
    lineHeight: 40,
    fontSize: 20,
    flex: 1,
  },
  translationText: {
    flex: 1,
  },
});

export default Verses;

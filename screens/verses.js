import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux"

import mosque from '../assets/mosque.png';

const Verses = ({ route }) => {
  const arabicText = useSelector((state) => state.settings.arabicText)
  const language = useSelector((state) => state.settings.language)
  const author = useSelector((state) => state.settings.author)
  // console.log(arabicText, language, author);
  
  const { surah } = route.params;
  // console.log(typeof(Number(surah.chapter)));
  const [verses, setVerses] = useState([]);
  // const [translations, setTranslations] = useState([]);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [soundObject, setSound] = useState( new Audio.Sound(""));

  useEffect(() => {
    // Fetch surah information
    setLoading(true);
    const fetchSurahInfo = async () => {
      if (surah) {
        await fetch(`http://192.168.29.253:3000/v1/scripture/quraan/get?language=${language}&chapter=${Number(surah.chapter)}&author=${author}&text=${arabicText}`)
          .then((response) => response.json())
          .then((data) => {
            data?.data.sort((a, b) => a.verse - b.verse); 
            setVerses(data?.data);
          })
          .catch((error) =>
          console.error("Error fetching verses for surah:", error)
          );
        }
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
    // fetchEnglishTranslation();
    fetchAudio();
    setLoading(false);
    // soundObject.loadAsync({uri:""})

  }, [surah]);

  if (loading || verses.length === 0 || audios.length === 0) {
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
  // if (!translations) {
  //   return (
  //     <View>
  //       <Text>No translations found</Text>
  //     </View>
  //   );
  // }

  // soundObject.loadAsync({uri:"https://cdn.islamic.network/quran/audio/192/ar.abdulbasitmurattal/1.mp3"})

  async function audioLoadHandler(i) {
    setPlaying(true);
    await soundObject.unloadAsync();
    await soundObject.loadAsync({uri:audios[i].audio})
    await audioHandler()
    // console.log('playing', i);
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
    // console.log('Audio play');
    // const url = audios[index].audio;
    // const { sound } = await Audio.Sound.createAsync({uri: url});
    // await sound.playAsync();
    try {
      await soundObject.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  return (
    <View  style={styles.background}>
      <View style={styles.headingContainer}>
        {/* <Image source={mosque}></Image> */}
        <View style={styles.heading}>
          <Text style={styles.title}>{surah.name}</Text>
          <Text>{surah.arabicName}</Text>
          <Text>Revelation: {surah.revelationPlace}</Text>
          <Text>Chapter: {surah.chapter}</Text>
          <Text>Verses: {surah.totalVerses}</Text>
        </View>
        <View>
          <ImageBackground source={mosque} resizeMode="cover" style={styles.mosqueImage}></ImageBackground>
        </View>
      </View>

      {/* Display verses with translations */}
      {verses.length > 0 && (
        <FlatList
          style={styles.verseContainer}
          data={verses}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <View style={styles.verseRow}>
               <View style={styles.controlsContainer}>
                <View style={{flexDirection: 'row', gap: 10}}>
                  {!playing ? (
                    <TouchableOpacity onPress={audioLoadHandler.bind(this, index)}>
                      <Ionicons name="play" size={24} color="#795547" />
                    </TouchableOpacity>
                    // <Button
                    // onPress={audioLoadHandler.bind(this, index)}
                    // title="Play"
                    // color="#841584"
                    // /> 
                    ) : (
                      <TouchableOpacity onPress={audioStopHandler}>
                        <Ionicons name="pause" size={24} color="#795547" />
                      </TouchableOpacity>
                      // <Button
                      // onPress={audioStopHandler}
                      // title="Stop"
                      // color="#841584"
                      // /> 
                    )
                  }
                  <TouchableOpacity onPress={(e) => console.log(e)}>
                      <Ionicons name="bookmark" size={24} color="#795547" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={(e) => console.log(e)}>
                      <Ionicons name="share" size={24} color="#795547" />
                  </TouchableOpacity>
                </View>
                <Text>{item.verse}</Text>
              </View>
              <Text style={styles.verseText}>{item.data.text}</Text>
              <Text style={styles.translationText}>{item.data.translation}</Text>
              {/* {translations.length > 0 && (
                <Text style={styles.translationText}>{`${translations[index]?.text}`}</Text>
              )} */}
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
    height: 150,
  },
  heading: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 24
  },
  mosqueImage: {
    flex: 1,
    width: 100,
    justifyContent: "center"
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
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fceddc',
  },
  verseText: {
    textAlign: 'right',
    lineHeight: 35,
    fontSize: 20,
    flex: 1,
  },
  translationText: {
    marginTop: 25,
    flex: 1,
  },
});

export default Verses;

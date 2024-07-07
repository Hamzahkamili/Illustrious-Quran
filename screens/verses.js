import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import * as SQLite from 'expo-sqlite';

import mosque from '../assets/mosque.png';

const Verses = ({ route }) => {
  const arabicText = useSelector((state) => state.settings.arabicText);
  const language = useSelector((state) => state.settings.language);
  const author = useSelector((state) => state.settings.author);
  const { surah } = route.params;
  const [verses, setVerses] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [soundObject, setSound] = useState(new Audio.Sound());

  // console.log('Surah:', surah.name);

  const initDB = async (surahName) => {
    const db = await SQLite.openDatabaseAsync(`${surahName}.db`);
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS Surahs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter INTEGER,
        verse INTEGER,
        simple TEXT,
        simpleClean TEXT,
        simplePlain TEXT,
        simpleMinimal TEXT,
        uthmani TEXT,
        uthmaniMinimal TEXT
      );`
    );
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS Translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surah_id INTEGER,
        language TEXT,
        author TEXT,
        translation TEXT,
        FOREIGN KEY (surah_id) REFERENCES Surahs(id)
      );`
    );
    return db;
  };

  const insertSurah = async (db, surahVerses) => {
    await db.execAsync('DELETE FROM Surahs');
    await db.execAsync('DELETE FROM Translations');
    try {
      for (const surahVerse of surahVerses) {
        const result = await db.runAsync(
          `INSERT INTO Surahs (chapter, verse, simple, simpleClean, simplePlain, simpleMinimal, uthmani, uthmaniMinimal) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            surahVerse.chapter,
            surahVerse.verse,
            surahVerse.text.simple,
            surahVerse.text.simpleClean,
            surahVerse.text.simplePlain,
            surahVerse.text.simpleMinimal,
            surahVerse.text.uthmani,
            surahVerse.text.uthmaniMinimal
          ]
        );
        const surahId = result.lastInsertRowId;
        for (const translation of surahVerse.translations) {
          await db.runAsync(
            `INSERT INTO Translations (surah_id, language, author, translation) VALUES (?, ?, ?, ?);`,
            [surahId, translation.language, translation.author, translation.translation]
          );
        }
      }
    } catch (error) {
      console.error('Error inserting Surah and translations:', error);
      throw error;
    }
  };

  const fetchSurahVerses = async (db) => {
    try {
      const results = await db.getAllAsync(`SELECT * FROM Surahs`);
      return results;
    } catch (error) {
      console.error('Error fetching Surah verses:', error);
      throw error;
    }
  };

  const fetchTranslations = async (db) => {
    try {
      const results = await db.getAllAsync(
        `SELECT * FROM Translations WHERE author = ? AND language = ?`,
        [author, language]
      );
      return results;
    } catch (error) {
      console.error('Error fetching translations:', error);
      throw error;
    }
  };

  const fetchSurahData = async () => {
    try {
      // const response = await fetch(`http://192.168.29.253:3000/v1/scripture/quraan/search/${surah.chapter}`);
      const response = await fetch(`https://illustriousquran-backend.onrender.com/v1/scripture/quraan/search/${surah.chapter}`);
      const data = await response.json();
      data?.data.sort((a, b) => a.verse - b.verse);
      return data?.data;
    } catch (error) {
      console.error("Error fetching surah data:", error);
      throw error;
    }
  };

  const fetchAudioData = async () => {
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah.chapter}/ar.abdulbasitmurattal`);
      const data = await response.json();
      return data.data.ayahs;
    } catch (error) {
      console.error("Error fetching audio data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const db = await initDB(surah.name);
      setLoading(true);

      try {

        const surahVerses = await fetchSurahVerses(db);
        const translations = await fetchTranslations(db);

        if (surahVerses.length > 0 && translations.length > 0) {
          setVerses(surahVerses);
          setTranslations(translations);
        } else {
          const surahData = await fetchSurahData();
          await insertSurah(db, surahData);

          const surahVerses = await fetchSurahVerses(db);
          const translations = await fetchTranslations(db);
          setVerses(surahVerses);
          setTranslations(translations);
        }

        const audioData = await fetchAudioData();
        setAudios(audioData);

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }

    };
    initialize();
  }, [surah]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#795547" />
      </View>
    );
  }

  const audioLoadHandler = async (index) => {
    setPlaying(true);
    await soundObject.unloadAsync();
    await soundObject.loadAsync({ uri: audios[index].audio });
    await soundObject.playAsync();
    soundObject.setOnPlaybackStatusUpdate(status => {
      if (status.didJustFinish) {
        setPlaying(false);
      }
    });
  };

  const audioStopHandler = async () => {
    setPlaying(false);
    await soundObject.stopAsync();
    await soundObject.unloadAsync();
  };

  return (
    <View style={styles.background}>
      <View style={styles.headingContainer}>
        <View style={styles.heading}>
          <Text style={styles.title}>{surah.name}</Text>
          <Text>{surah.arabicName}</Text>
          <Text>Revelation: {surah.revelationPlace}</Text>
          <Text>Chapter: {surah.chapter}</Text>
          <Text>Verses: {surah.totalVerses}</Text>
        </View>
        <ImageBackground source={mosque} resizeMode="cover" style={styles.mosqueImage}></ImageBackground>
      </View>
      {surah.name !== 'Al-Fatihah' && <Text style={{textAlign: 'center', fontSize: 25}}>بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ</Text>}
      <FlatList
        showsVerticalScrollIndicator={false}
        style={styles.verseContainer}
        data={verses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.verseRow}>
            <View style={styles.controlsContainer}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {!playing ? (
                  <TouchableOpacity onPress={() => audioLoadHandler(index)}>
                    <Ionicons name="play" size={24} color="#795547" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={audioStopHandler}>
                    <Ionicons name="pause" size={24} color="#795547" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => console.log('Bookmark pressed')}>
                  <Ionicons name="bookmark" size={24} color="#795547" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('Share pressed')}>
                  <Ionicons name="share" size={24} color="#795547" />
                </TouchableOpacity>
              </View>
              <Text>{item.verse}</Text>
            </View>
            <Text style={styles.verseText}>{surah.name === 'Al-Fatihah' ? item[arabicText] : item[arabicText].replace('بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ', "")}</Text>
            {translations[index] && (
              <Text style={styles.translationText}>{translations[index].translation}</Text>
            )}
          </View>
        )}
      />
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
    marginTop: 15,
    flex: 1,
    marginBottom: 10,
  },
});

export default Verses;

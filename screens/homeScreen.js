import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Modal, Image, TouchableOpacity } from "react-native";
import * as SQLite from 'expo-sqlite';
import mosque from '../assets/mosque.png';

const HomeScreen = ({ navigation }) => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

  const initDB = async () => {
    const db = await SQLite.openDatabaseAsync('surahs.db');
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS surahs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter TEXT NOT NULL,
        totalVerses INTEGER NOT NULL,
        name TEXT NOT NULL,
        nameTranslation TEXT,
        arabicName TEXT NOT NULL,
        revelationPlace TEXT,
        revelationOrder INTEGER,
        summarySource TEXT,
        summaryText TEXT
      );
    `);
    return db;
  };

  const insertSurahs = async (db, surahs) => {
    await db.execAsync('DELETE FROM surahs');
    const insertPromises = surahs.map(surah =>
      db.runAsync(
        `INSERT INTO surahs (chapter, totalVerses, name, nameTranslation, arabicName, revelationPlace, revelationOrder, summarySource, summaryText) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          surah.chapter,
          surah.totalVerses,
          surah.name,
          surah.nameTranslation,
          surah.arabicName,
          surah.revelationPlace,
          surah.revelationOrder,
          surah.summary?.source,
          surah.summary?.text
        ]
      )
    );
    await Promise.all(insertPromises);
  };

  const fetchSurahsFromDB = async (db) => {
    const allRows = await db.getAllAsync('SELECT * FROM surahs');
    const dbSurahs = allRows.map(item => ({
      chapter: item.chapter,
      totalVerses: item.totalVerses,
      name: item.name,
      nameTranslation: item.nameTranslation,
      arabicName: item.arabicName,
      revelationPlace: item.revelationPlace,
      revelationOrder: item.revelationOrder,
      summary: {
        source: item.summarySource,
        text: item.summaryText
      }
    }));
    // setSurahs(dbSurahs);
    return dbSurahs;
  };

  const fetchSurahsFromAPI = async () => {
    console.log("fetchSurahsFromAPI");
    try {
      setLoading(true);
      const response = await fetch("https://illustriousquran-backend.onrender.com/v1/scripture/chapterMetaData/all");
      const data = await response.json();
      data?.data.sort((a, b) => a.chapter - b.chapter);
      // console.log(data?.data);
      return data?.data;
    } catch (error) {
      console.error("Error fetching Quran surah names:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const db = await initDB();

      const surahfromdb = await fetchSurahsFromDB(db);
      setSurahs(surahfromdb);
      // console.log(surahfromdb);
      if (surahfromdb.length === 0) {
        const apiSurahs = await fetchSurahsFromAPI();
        setSurahs(apiSurahs);
        await insertSurahs(db, apiSurahs);
      }
    };

    initialize();
  }, []);

  const handleSurahPress = (surah) => {
    navigation.navigate('Verses', { surah });
  };

  const renderSurahItem = ({ item }) => (
    <Pressable onPress={() => handleSurahPress(item)}>
      <View style={styles.surahContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.numberContainer}>
            <Text style={styles.surahItem}>{item.chapter}</Text>
          </View>
          <View>
            <Text style={styles.surahItem}>{item.name}</Text>
            <Text style={styles.surahDescription}>{item.totalVerses} Verses | {item.revelationPlace}</Text>
          </View>
        </View>
        <Text style={styles.surahItem}>{item.arabicName}</Text>
      </View>
    </Pressable>
  );

  const renderModal = () => (
    <Modal visible={open} animationType="none">
      <View style={styles.modelContainer}>
        <View>
          <Text style={styles.title}>Illustrious Quran</Text>
          <Text style={styles.subtitle}>Learn Quran and recite once everyday</Text>
        </View>
        <View style={{ alignItems: 'center', marginVertical: 25 }}>
          <Image source={mosque} />
        </View>
        {loading ? <ActivityIndicator size="large" color="#795547" /> : <TouchableOpacity style={styles.button} onPress={() => setOpen(false)}>
            <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>}
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {open && renderModal()}
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.chapter.toString()}
        renderItem={renderSurahItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#795547',
  },
  subtitle: {
    fontSize: 16,
    color: '#795547',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#795547',
    paddingVertical: 15,
    width: 150,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 9,
    backgroundColor: "#fffaf5",
    paddingHorizontal: 10,
  },
  surahContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  numberContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#fceddc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#fceddc",
    color: '#795547',
  },
  surahDescription: {
    color: '#D7A86E',
    fontSize: 12,
  },
});

export default HomeScreen;

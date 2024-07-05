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
    for (const surah of surahs) {
      await db.runAsync(
        `INSERT INTO surahs (chapter, totalVerses, name, nameTranslation, arabicName, revelationPlace, revelationOrder, summarySource, summaryText) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        surah.chapter,
        surah.totalVerses,
        surah.name,
        surah.nameTranslation,
        surah.arabicName,
        surah.revelationPlace,
        surah.revelationOrder,
        surah.summary?.source,
        surah.summary?.text
      );
    }
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
    setSurahs(dbSurahs);
  };

  useEffect(() => {
    const initialize = async () => {
      const db = await initDB();
      
      try {
        if (surahs.length < 0) {
          setLoading(true);
          const response = await fetch("https://illustriousquran-backend.onrender.com/v1/scripture/chapterMetaData/all");
          const data = await response.json();
          data?.data.sort((a, b) => a.chapter - b.chapter);
          setSurahs(data?.data);
          await insertSurahs(db, data?.data);
        }
      } catch (error) {
        console.error("Error fetching Quran surah names:", error);
      } finally {
        await fetchSurahsFromDB(db);
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleSurahPress = (surah) => {
    navigation.navigate('Verses', { surah });
  };

  if (loading) {
    return (
        <View style={styles.modelContainer}>
          <View>
            <Text style={styles.title}>Illustrious Quran</Text>
            <Text style={styles.subtitle}>Learn quran and</Text>
            <Text style={styles.subtitle}>recite once everyday</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Image source={mosque} />
          </View>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal visible={open} animationType="none">
        <View style={styles.modelContainer}>
          <View>
            <Text style={styles.title}>Illustrious Quran</Text>
            <Text style={styles.subtitle}>Learn quran and</Text>
            <Text style={styles.subtitle}>recite once everyday</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Image source={mosque} />
            <TouchableOpacity style={styles.button} onPress={() => setOpen(false)}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.chapter.toString()}
        renderItem={({ item }) => (
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
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  }
});

export default HomeScreen;
